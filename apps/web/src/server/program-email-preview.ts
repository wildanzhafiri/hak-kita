import 'server-only';
import { randomUUID } from 'node:crypto';
import { createClient } from '@supabase/supabase-js';
import { ProgramSchema } from '@hakkita/schema';
import type { Database } from '@/lib/supabase/types';
import { EMAIL_PREFERENCE_PAGE_SIZE } from './constants';
import { PROGRAM_EMAIL_PREVIEW_NEWS } from './content';
import { buildProgramNewsEmail } from './program-news';
import { sendProgramEmail } from './program-email-sender';

export async function sendProgramEmailPreview(recipientEmail: string): Promise<void> {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  const siteUrl = process.env.HAKKITA_SITE_URL;
  if (!url || !key || !siteUrl || !process.env.RESEND_API_KEY || !process.env.EMAIL_FROM) {
    throw new Error('Program email preview is not configured');
  }
  const client = createClient<Database>(url, key, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
  let offset = 0;
  let userId: string | null = null;

  while (!userId) {
    const { data: preferences, error } = await client
      .from('program_email_preferences')
      .select('user_id')
      .eq('enabled', true)
      .order('user_id')
      .range(offset, offset + EMAIL_PREFERENCE_PAGE_SIZE - 1);
    if (error) throw error;
    for (const preference of preferences) {
      const { data: account, error: accountError } = await client.auth.admin.getUserById(
        preference.user_id,
      );
      if (accountError) continue;
      if (
        account.user.email?.toLowerCase() === recipientEmail.toLowerCase() &&
        account.user.email_confirmed_at
      ) {
        userId = preference.user_id;
        break;
      }
    }
    if (preferences.length < EMAIL_PREFERENCE_PAGE_SIZE) break;
    offset += EMAIL_PREFERENCE_PAGE_SIZE;
  }
  if (!userId) throw new Error('No confirmed account with email notifications enabled');

  const { data: follow, error: followError } = await client
    .from('program_follows')
    .select('program_id')
    .eq('user_id', userId)
    .eq('program_id', PROGRAM_EMAIL_PREVIEW_NEWS.program_id)
    .order('created_at')
    .limit(1)
    .maybeSingle();
  if (followError) throw followError;
  if (!follow) throw new Error('The account does not follow KIP Kuliah');

  const { data: record, error: programError } = await client
    .from('programs')
    .select('record')
    .eq('id', follow.program_id)
    .single();
  if (programError) throw programError;
  const parsed = ProgramSchema.safeParse(record.record);
  if (!parsed.success || parsed.data.id !== follow.program_id) {
    throw new Error('Followed program record is invalid');
  }
  const program = parsed.data;

  await sendProgramEmail(
    buildProgramNewsEmail(
      recipientEmail,
      program,
      PROGRAM_EMAIL_PREVIEW_NEWS,
      siteUrl,
      randomUUID(),
      PROGRAM_EMAIL_PREVIEW_NEWS.note,
    ),
  );
}
