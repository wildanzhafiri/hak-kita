import 'server-only';
import { createClient } from '@supabase/supabase-js';
import { ProgramSchema } from '@hakkita/schema';
import type { Database } from '@/lib/supabase/types';
import { EMAIL_PREFERENCE_PAGE_SIZE } from './constants';
import { buildProgramNewsEmail, createProgramNewsEmailId } from './program-news';
import { sendFollowedProgramNews } from './program-news-notifications';

function createDeliveryClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key || !process.env.HAKKITA_SITE_URL) throw new Error('Pengiriman email belum siap');
  return createClient<Database>(url, key, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
}

async function loadApprovedNews(newsId: string) {
  const client = createDeliveryClient();
  const { data: news, error: newsError } = await client
    .from('program_news')
    .select('*')
    .eq('id', newsId)
    .single();
  if (newsError) throw newsError;
  const { data: programRecord, error: programError } = await client
    .from('programs')
    .select('record')
    .eq('id', news.program_id)
    .single();
  if (programError) throw programError;
  const parsedProgram = ProgramSchema.safeParse(programRecord.record);
  if (!parsedProgram.success || parsedProgram.data.id !== news.program_id) {
    throw new Error('Informasi program tidak valid');
  }
  return { client, news, program: parsedProgram.data };
}

export async function loadProgramNewsEmailPreview(newsId: string) {
  const { client, news, program } = await loadApprovedNews(newsId);
  const { data: follows, error: followsError } = await client
    .from('program_follows')
    .select('user_id')
    .eq('program_id', news.program_id);
  if (followsError) throw followsError;
  const userIds = [...new Set(follows.map((follow) => follow.user_id))];
  let eligibleCount = 0;
  for (let offset = 0; offset < userIds.length; offset += EMAIL_PREFERENCE_PAGE_SIZE) {
    const batch = userIds.slice(offset, offset + EMAIL_PREFERENCE_PAGE_SIZE);
    const { data: preferences, error } = await client
      .from('program_email_preferences')
      .select('user_id')
      .eq('enabled', true)
      .in('user_id', batch);
    if (error) throw error;
    eligibleCount += preferences.length;
  }
  const email = buildProgramNewsEmail(
    'pratinjau@hakkita.id',
    program,
    news,
    process.env.HAKKITA_SITE_URL ?? '',
    createProgramNewsEmailId('preview', news.id),
  );
  const logoUrl = new URL('/hakkita-logo.png', process.env.HAKKITA_SITE_URL).toString();
  return {
    subject: email.subject,
    text: email.text,
    html: email.html.replace('cid:hakkita-logo', logoUrl),
    eligibleCount,
  };
}

export async function sendApprovedProgramNewsNow(newsId: string) {
  if (!process.env.RESEND_API_KEY || !process.env.EMAIL_FROM)
    throw new Error('Pengiriman email belum dikonfigurasi');
  const { client, news, program } = await loadApprovedNews(newsId);
  const siteUrl = process.env.HAKKITA_SITE_URL;
  if (!siteUrl) throw new Error('Alamat HAKKITA belum dikonfigurasi');
  let sent = 0;
  let failed = 0;
  let offset = 0;
  while (true) {
    const { data: follows, error: followsError } = await client
      .from('program_follows')
      .select('user_id,program_id,snapshot,created_at,updated_at')
      .eq('program_id', news.program_id)
      .order('user_id')
      .range(offset, offset + EMAIL_PREFERENCE_PAGE_SIZE - 1);
    if (followsError) throw followsError;
    const userIds = [...new Set(follows.map((follow) => follow.user_id))];
    if (userIds.length > 0) {
      const { data: preferences, error: preferenceError } = await client
        .from('program_email_preferences')
        .select('user_id,enabled,enabled_at,updated_at')
        .eq('enabled', true)
        .in('user_id', userIds);
      if (preferenceError) throw preferenceError;
      const preferenceByUser = new Map(
        preferences.map((preference) => [preference.user_id, preference]),
      );
      for (let batchOffset = 0; batchOffset < follows.length; batchOffset += 8) {
        const batch = follows.slice(batchOffset, batchOffset + 8);
        const results = await Promise.allSettled(
          batch.map(async (follow) => {
            const preference = preferenceByUser.get(follow.user_id);
            if (!preference) return false;
            return sendFollowedProgramNews(client, preference, follow, program, news, siteUrl);
          }),
        );
        for (const result of results) {
          if (result.status === 'rejected') failed += 1;
          else if (result.value) sent += 1;
        }
      }
    }
    if (follows.length < EMAIL_PREFERENCE_PAGE_SIZE) break;
    offset += EMAIL_PREFERENCE_PAGE_SIZE;
  }
  return { sent, failed };
}
