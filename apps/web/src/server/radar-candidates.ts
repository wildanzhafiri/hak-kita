import 'server-only';
import type { SupabaseClient } from '@supabase/supabase-js';
import type { Program } from '@hakkita/schema';
import type { Database } from '@/lib/supabase/types';
import { draftRadarCandidate } from './radar-draft';
import type { ProgramSourceFingerprint } from './types';

export async function queueRadarCandidate(
  client: SupabaseClient<Database>,
  program: Program,
  sourceUrl: string,
  source: ProgramSourceFingerprint,
): Promise<void> {
  const { data: pending, error: pendingError } = await client
    .from('program_radar_candidates')
    .select('id')
    .eq('program_id', program.id)
    .eq('source_url', sourceUrl)
    .eq('status', 'pending')
    .limit(1);
  if (pendingError) throw pendingError;
  if (pending.length > 0) return;

  const { data: candidate, error: insertError } = await client
    .from('program_radar_candidates')
    .upsert(
      {
        program_id: program.id,
        source_url: sourceUrl,
        source_fingerprint: source.fingerprint,
      },
      { onConflict: 'program_id,source_url,source_fingerprint', ignoreDuplicates: true },
    )
    .select('id')
    .maybeSingle();
  if (insertError) throw insertError;
  if (!candidate) return;

  try {
    const draft = await draftRadarCandidate(program, sourceUrl, source);
    if (!draft) return;
    const { error: updateError } = await client
      .from('program_radar_candidates')
      .update({
        evidence_quote: draft.evidenceQuote,
        draft_title: draft.title,
        draft_summary: draft.summary,
        draft_email_text: draft.emailText,
        published_on: draft.publishedOn,
      })
      .eq('id', candidate.id)
      .eq('status', 'pending');
    if (updateError) throw updateError;
  } catch {
    return;
  }
}
