import 'server-only';
import { createClient } from '@supabase/supabase-js';
import type { SupabaseClient } from '@supabase/supabase-js';
import { createProgramFollowSnapshot, getProgramChanges, todayWIB } from '@hakkita/domain';
import { ProgramSchema } from '@hakkita/schema';
import type { Database } from '@/lib/supabase/types';
import { EMAIL_CLAIM_TIMEOUT_MS, EMAIL_PREFERENCE_PAGE_SIZE } from './constants';
import {
  buildProgramEmail,
  createProgramEmailId,
  resolveProgramEmailBaseline,
} from './program-email';
import { sendProgramEmail } from './program-email-sender';
import type {
  CurrentEmailProgram,
  EmailPreference,
  ProgramEmailRunOptions,
  ProgramEmailRunResult,
  ProgramFollow,
} from './types';

async function loadCurrentPrograms(
  client: SupabaseClient<Database>,
): Promise<Map<string, CurrentEmailProgram>> {
  const programs = new Map<string, CurrentEmailProgram>();
  let offset = 0;

  while (true) {
    const { data, error } = await client
      .from('programs')
      .select('id,record,updated_at')
      .order('id')
      .range(offset, offset + EMAIL_PREFERENCE_PAGE_SIZE - 1);
    if (error) throw error;
    for (const row of data) {
      const parsed = ProgramSchema.safeParse(row.record);
      if (!parsed.success || parsed.data.id !== row.id) {
        throw new Error('Program database record is invalid');
      }
      if (parsed.data.verifikasi === 'belum') continue;
      programs.set(row.id, { program: parsed.data, updatedAt: row.updated_at });
    }
    if (data.length < EMAIL_PREFERENCE_PAGE_SIZE) break;
    offset += EMAIL_PREFERENCE_PAGE_SIZE;
  }

  return programs;
}

async function saveBaseline(
  client: SupabaseClient<Database>,
  userId: string,
  programId: string,
  snapshot: ProgramFollow['snapshot'],
): Promise<void> {
  const { error } = await client.from('program_email_state').upsert({
    user_id: userId,
    program_id: programId,
    snapshot,
    updated_at: new Date().toISOString(),
  });
  if (error) throw error;
}

async function claimDelivery(
  client: SupabaseClient<Database>,
  deliveryId: string,
): Promise<boolean> {
  const now = new Date();
  const staleBefore = new Date(now.getTime() - EMAIL_CLAIM_TIMEOUT_MS).toISOString();
  const { data: available, error: availableError } = await client
    .from('program_email_deliveries')
    .update({ status: 'sending', claimed_at: now.toISOString() })
    .eq('id', deliveryId)
    .in('status', ['pending', 'failed'])
    .select('id')
    .maybeSingle();
  if (availableError) throw availableError;
  if (available) return true;

  const { data: stale, error: staleError } = await client
    .from('program_email_deliveries')
    .update({ status: 'sending', claimed_at: now.toISOString() })
    .eq('id', deliveryId)
    .eq('status', 'sending')
    .lt('claimed_at', staleBefore)
    .select('id')
    .maybeSingle();
  if (staleError) throw staleError;
  return !!stale;
}

async function processFollow(
  client: SupabaseClient<Database>,
  preference: EmailPreference,
  follow: ProgramFollow,
  currentProgram: CurrentEmailProgram,
  today: string,
  siteUrl: string,
): Promise<boolean> {
  const { program, updatedAt } = currentProgram;
  const currentSnapshot = createProgramFollowSnapshot(program, today);
  const { data: state, error: stateError } = await client
    .from('program_email_state')
    .select('snapshot,updated_at')
    .eq('user_id', preference.user_id)
    .eq('program_id', follow.program_id)
    .maybeSingle();
  if (stateError) throw stateError;

  const baseline = resolveProgramEmailBaseline(
    state,
    preference.enabled_at,
    follow,
    currentSnapshot,
  );
  if (baseline.shouldSeed) {
    await saveBaseline(client, preference.user_id, follow.program_id, baseline.snapshot);
    if (baseline.snapshot === currentSnapshot) return false;
  }

  const changes = getProgramChanges(baseline.snapshot, program, today);
  if (changes.length === 0) {
    return false;
  }

  const deliveryId = createProgramEmailId(
    preference.user_id,
    follow.program_id,
    updatedAt,
    currentSnapshot,
  );
  const { error: insertError } = await client.from('program_email_deliveries').insert({
    id: deliveryId,
    user_id: preference.user_id,
    program_id: follow.program_id,
    snapshot: currentSnapshot,
  });
  if (insertError && insertError.code !== '23505') throw insertError;

  const { data: delivery, error: deliveryError } = await client
    .from('program_email_deliveries')
    .select('status')
    .eq('id', deliveryId)
    .single();
  if (deliveryError) throw deliveryError;
  if (delivery.status === 'sent') {
    await saveBaseline(client, preference.user_id, follow.program_id, currentSnapshot);
    return false;
  }
  if (!(await claimDelivery(client, deliveryId))) return false;

  try {
    const { data: latestPreference, error: preferenceError } = await client
      .from('program_email_preferences')
      .select('enabled,enabled_at')
      .eq('user_id', preference.user_id)
      .single();
    if (preferenceError) throw preferenceError;
    const { data: latestFollow, error: followError } = await client
      .from('program_follows')
      .select('program_id')
      .eq('user_id', preference.user_id)
      .eq('program_id', follow.program_id)
      .maybeSingle();
    if (followError) throw followError;
    if (
      !latestPreference.enabled ||
      latestPreference.enabled_at !== preference.enabled_at ||
      !latestFollow
    ) {
      const { error } = await client
        .from('program_email_deliveries')
        .update({ status: 'failed', claimed_at: null })
        .eq('id', deliveryId);
      if (error) throw error;
      return false;
    }

    const { data: account, error: accountError } = await client.auth.admin.getUserById(
      preference.user_id,
    );
    if (accountError) throw accountError;
    if (!account.user.email || !account.user.email_confirmed_at) {
      throw new Error('Account has no confirmed email');
    }

    await sendProgramEmail(
      buildProgramEmail(
        account.user.email,
        program,
        changes,
        baseline.snapshot,
        siteUrl,
        deliveryId,
      ),
    );
    const { error: sentError } = await client
      .from('program_email_deliveries')
      .update({ status: 'sent', sent_at: new Date().toISOString() })
      .eq('id', deliveryId);
    if (sentError) throw sentError;
    await saveBaseline(client, preference.user_id, follow.program_id, currentSnapshot);
    return true;
  } catch (error) {
    await client
      .from('program_email_deliveries')
      .update({ status: 'failed', claimed_at: null })
      .eq('id', deliveryId);
    throw error;
  }
}

export async function runProgramEmailNotifications(
  options: ProgramEmailRunOptions = {},
): Promise<ProgramEmailRunResult> {
  if (options.onlyRecipientEmail && process.env.NODE_ENV !== 'development') {
    throw new Error('Scoped email runs are available only in development');
  }
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  const siteUrl = process.env.HAKKITA_SITE_URL;
  if (
    process.env.DEMO_OFFLINE === 'true' ||
    !url ||
    !serviceRoleKey ||
    !siteUrl ||
    !process.env.RESEND_API_KEY ||
    !process.env.EMAIL_FROM
  ) {
    throw new Error('Program email notifications are not configured');
  }

  const client = createClient<Database>(url, serviceRoleKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
  const programs = await loadCurrentPrograms(client);
  if (programs.size === 0) throw new Error('No program records are available for email');
  const result: ProgramEmailRunResult = { checked: 0, sent: 0, failed: 0 };
  const today = todayWIB();
  let offset = 0;

  while (true) {
    const { data: preferences, error } = await client
      .from('program_email_preferences')
      .select('user_id,enabled,enabled_at,updated_at')
      .eq('enabled', true)
      .order('user_id')
      .range(offset, offset + EMAIL_PREFERENCE_PAGE_SIZE - 1);
    if (error) throw error;

    for (const preference of preferences) {
      if (options.onlyRecipientEmail) {
        const { data: account, error: accountError } = await client.auth.admin.getUserById(
          preference.user_id,
        );
        if (
          accountError ||
          account.user.email?.toLowerCase() !== options.onlyRecipientEmail.toLowerCase()
        ) {
          continue;
        }
      }
      const { data: follows, error: followsError } = await client
        .from('program_follows')
        .select('user_id,program_id,snapshot,created_at,updated_at')
        .eq('user_id', preference.user_id);
      if (followsError) {
        result.failed += 1;
        continue;
      }

      for (const follow of follows) {
        const program = programs.get(follow.program_id);
        if (!program) continue;
        result.checked += 1;
        try {
          if (await processFollow(client, preference, follow, program, today, siteUrl)) {
            result.sent += 1;
          }
        } catch {
          result.failed += 1;
        }
      }
    }

    if (preferences.length < EMAIL_PREFERENCE_PAGE_SIZE) break;
    offset += EMAIL_PREFERENCE_PAGE_SIZE;
  }

  return result;
}
