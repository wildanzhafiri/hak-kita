import 'server-only';
import { createClient } from '@supabase/supabase-js';
import { isOfficialDomain, todayWIB } from '@hakkita/domain';
import type { RadarReviewRequest } from '@hakkita/schema';
import type { Database } from '@/lib/supabase/types';
import { loadPrograms } from './data';
import type { RadarCandidateView } from './types';

function createRadarClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) throw new Error('Radar belum dikonfigurasi');
  return createClient<Database>(url, key, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
}

export async function loadPendingRadarCandidates(): Promise<RadarCandidateView[]> {
  const client = createRadarClient();
  const [{ data, error }, programs] = await Promise.all([
    client
      .from('program_radar_candidates')
      .select('*')
      .eq('status', 'pending')
      .order('detected_at', { ascending: false })
      .limit(100),
    loadPrograms(),
  ]);
  if (error) throw error;
  const names = new Map(programs.map((program) => [program.id, program.nama]));
  return data.map((candidate) => ({
    ...candidate,
    program_name: names.get(candidate.program_id) ?? candidate.program_id,
  }));
}

export async function loadReviewedRadarCandidates(): Promise<RadarCandidateView[]> {
  const client = createRadarClient();
  const [{ data, error }, programs] = await Promise.all([
    client
      .from('program_radar_candidates')
      .select('*')
      .in('status', ['approved', 'rejected'])
      .order('reviewed_at', { ascending: false })
      .limit(100),
    loadPrograms(),
  ]);
  if (error) throw error;
  const names = new Map(programs.map((program) => [program.id, program.nama]));
  return data.map((candidate) => ({
    ...candidate,
    program_name: names.get(candidate.program_id) ?? candidate.program_id,
  }));
}

export async function reviewRadarCandidate(
  review: RadarReviewRequest,
  reviewerId: string,
): Promise<string | null> {
  if (review.action === 'approve') {
    if (review.publishedOn > todayWIB())
      throw new Error('Tanggal terbit belum boleh di masa depan');
    if (
      review.extraSourceUrls.some(
        (sourceUrl) => !sourceUrl.startsWith('https://') || !isOfficialDomain(sourceUrl),
      )
    ) {
      throw new Error('Sumber tambahan harus berasal dari situs resmi pemerintah');
    }
  }

  const client = createRadarClient();
  const { data, error } = await client.rpc('review_program_radar_candidate', {
    p_candidate_id: review.candidateId,
    p_reviewer_id: reviewerId,
    p_action: review.action,
    ...(review.action === 'approve'
      ? {
          p_title: review.title,
          p_summary: review.summary,
          p_published_on: review.publishedOn,
          p_email_text: review.emailText,
          p_extra_source_urls: review.extraSourceUrls,
        }
      : {}),
  });
  if (error) throw error;
  return data;
}
