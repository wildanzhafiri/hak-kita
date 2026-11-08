import 'server-only';
import { createClient } from '@supabase/supabase-js';
import { buildCuratedKnowledge, buildProgramKnowledge, isOfficialDomain } from '@hakkita/domain';
import type { KnowledgeDocument, Program } from '@hakkita/schema';
import type { Database } from '@/lib/supabase/types';
import { SOURCE_CHECK_BATCH_SIZE } from './constants';
import { loadKnowledgeDocuments, loadPrograms } from './data';
import { readProgramSourceFingerprint } from './program-source-fingerprint';
import type { ProgramSourceMonitorResult } from './types';

export function collectProgramSourceUrls(
  programs: readonly Program[],
  documents: readonly KnowledgeDocument[] = [],
): string[] {
  const checkedPrograms = programs.filter(
    (program) => program.verifikasi !== 'belum' && program.tanggalDiperiksa,
  );
  const sourceUrls = [
    ...checkedPrograms.map((program) => program.sumberUtama.url),
    ...buildProgramKnowledge(checkedPrograms).map((passage) => passage.sourceUrl),
    ...buildCuratedKnowledge(documents, checkedPrograms).map((passage) => passage.sourceUrl),
  ];
  return [...new Set(sourceUrls)].filter(
    (sourceUrl) => sourceUrl.startsWith('https://') && isOfficialDomain(sourceUrl),
  );
}

export async function runProgramSourceMonitor(): Promise<ProgramSourceMonitorResult> {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (process.env.DEMO_OFFLINE === 'true' || !url || !serviceRoleKey) {
    throw new Error('Program source monitoring is not configured');
  }

  const [programs, documents] = await Promise.all([loadPrograms(), loadKnowledgeDocuments()]);
  const sourceUrls = collectProgramSourceUrls(programs, documents);
  if (sourceUrls.length === 0) throw new Error('No checked program sources are available');

  const client = createClient<Database>(url, serviceRoleKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
  const result: ProgramSourceMonitorResult = { checked: 0, changed: [], failed: [] };

  for (let offset = 0; offset < sourceUrls.length; offset += SOURCE_CHECK_BATCH_SIZE) {
    const batch = sourceUrls.slice(offset, offset + SOURCE_CHECK_BATCH_SIZE);
    await Promise.all(
      batch.map(async (sourceUrl) => {
        try {
          const { data: previous, error: readError } = await client
            .from('program_source_observations')
            .select('*')
            .eq('source_url', sourceUrl)
            .maybeSingle();
          if (readError) throw readError;

          const current = await readProgramSourceFingerprint(
            sourceUrl,
            previous?.etag,
            previous?.last_modified,
          );
          const checkedAt = new Date().toISOString();
          if (!current) {
            if (!previous) throw new Error('Source returned 304 without a stored fingerprint');
            const { error } = await client
              .from('program_source_observations')
              .update({ last_checked_at: checkedAt, last_error: null })
              .eq('source_url', sourceUrl);
            if (error) throw error;
            result.checked += 1;
            if (previous.changed_at) result.changed.push(sourceUrl);
            return;
          }

          if (!previous) {
            const { error } = await client.from('program_source_observations').insert({
              source_url: sourceUrl,
              baseline_fingerprint: current.fingerprint,
              latest_fingerprint: current.fingerprint,
              etag: current.etag,
              last_modified: current.lastModified,
              first_checked_at: checkedAt,
              last_checked_at: checkedAt,
            });
            if (error) throw error;
            result.checked += 1;
            return;
          }

          const hasChanged = current.fingerprint !== previous.baseline_fingerprint;
          const changedAt = hasChanged ? (previous.changed_at ?? checkedAt) : null;
          const { error } = await client
            .from('program_source_observations')
            .update({
              latest_fingerprint: current.fingerprint,
              etag: current.etag,
              last_modified: current.lastModified,
              last_checked_at: checkedAt,
              changed_at: changedAt,
              last_error: null,
            })
            .eq('source_url', sourceUrl);
          if (error) throw error;
          result.checked += 1;
          if (hasChanged) result.changed.push(sourceUrl);
        } catch (error) {
          result.failed.push(sourceUrl);
          const message = error instanceof Error ? error.message : 'Source check failed';
          await client
            .from('program_source_observations')
            .update({ last_checked_at: new Date().toISOString(), last_error: message })
            .eq('source_url', sourceUrl);
        }
      }),
    );
  }

  return result;
}
