import 'server-only';
import type { SupabaseClient } from '@supabase/supabase-js';
import { shouldNotifyProgramNews } from '@hakkita/domain';
import type { Program } from '@hakkita/schema';
import type { Database } from '@/lib/supabase/types';
import { EMAIL_CLAIM_TIMEOUT_MS, EMAIL_PREFERENCE_PAGE_SIZE } from './constants';
import { buildProgramNewsEmail, createProgramNewsEmailId } from './program-news';
import { sendProgramEmail } from './program-email-sender';
import type { EmailPreference, ProgramFollow, ProgramNews } from './types';

export async function loadProgramNews(
  client: SupabaseClient<Database>,
): Promise<Map<string, ProgramNews[]>> {
  const byProgram = new Map<string, ProgramNews[]>();
  let offset = 0;

  while (true) {
    const { data, error } = await client
      .from('program_news')
      .select('id,program_id,title,summary,source_url,published_on,created_at')
      .order('created_at')
      .order('id')
      .range(offset, offset + EMAIL_PREFERENCE_PAGE_SIZE - 1);
    if (error) throw error;
    for (const news of data) {
      byProgram.set(news.program_id, [...(byProgram.get(news.program_id) ?? []), news]);
    }
    if (data.length < EMAIL_PREFERENCE_PAGE_SIZE) break;
    offset += EMAIL_PREFERENCE_PAGE_SIZE;
  }

  return byProgram;
}

async function claimNewsDelivery(
  client: SupabaseClient<Database>,
  deliveryId: string,
): Promise<boolean> {
  const now = new Date();
  const staleBefore = new Date(now.getTime() - EMAIL_CLAIM_TIMEOUT_MS).toISOString();
  const { data: available, error: availableError } = await client
    .from('program_news_email_deliveries')
    .update({ status: 'sending', claimed_at: now.toISOString() })
    .eq('id', deliveryId)
    .in('status', ['pending', 'failed'])
    .select('id')
    .maybeSingle();
  if (availableError) throw availableError;
  if (available) return true;

  const { data: stale, error: staleError } = await client
    .from('program_news_email_deliveries')
    .update({ status: 'sending', claimed_at: now.toISOString() })
    .eq('id', deliveryId)
    .eq('status', 'sending')
    .lt('claimed_at', staleBefore)
    .select('id')
    .maybeSingle();
  if (staleError) throw staleError;
  return !!stale;
}

export async function sendFollowedProgramNews(
  client: SupabaseClient<Database>,
  preference: EmailPreference,
  follow: ProgramFollow,
  program: Program,
  news: ProgramNews,
  siteUrl: string,
): Promise<boolean> {
  if (!shouldNotifyProgramNews(news.created_at, follow.created_at, preference.enabled_at)) {
    return false;
  }

  const deliveryId = createProgramNewsEmailId(preference.user_id, news.id);
  const { error: insertError } = await client.from('program_news_email_deliveries').insert({
    id: deliveryId,
    user_id: preference.user_id,
    program_id: follow.program_id,
    news_id: news.id,
  });
  if (insertError && insertError.code !== '23505') throw insertError;

  const { data: delivery, error: deliveryError } = await client
    .from('program_news_email_deliveries')
    .select('status')
    .eq('id', deliveryId)
    .single();
  if (deliveryError) throw deliveryError;
  if (delivery.status === 'sent' || !(await claimNewsDelivery(client, deliveryId))) return false;

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
        .from('program_news_email_deliveries')
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
      buildProgramNewsEmail(account.user.email, program, news, siteUrl, deliveryId),
    );
    const { error: sentError } = await client
      .from('program_news_email_deliveries')
      .update({ status: 'sent', sent_at: new Date().toISOString() })
      .eq('id', deliveryId);
    if (sentError) throw sentError;
    return true;
  } catch (error) {
    await client
      .from('program_news_email_deliveries')
      .update({ status: 'failed', claimed_at: null })
      .eq('id', deliveryId);
    throw error;
  }
}
