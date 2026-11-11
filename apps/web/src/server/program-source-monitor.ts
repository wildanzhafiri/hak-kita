import 'server-only';
import { createClient } from '@supabase/supabase-js';
import { buildCuratedKnowledge, buildProgramKnowledge, isOfficialDomain } from '@hakkita/domain';
import type { KnowledgeDocument, Program, RadarSourceOutcome } from '@hakkita/schema';
import type { Database } from '@/lib/supabase/types';
import { SOURCE_CHECK_BATCH_SIZE } from './constants';
import { loadKnowledgeDocuments, loadPrograms } from './data';
import { readProgramSourceFingerprint } from './program-source-fingerprint';
import { queueRadarCandidate } from './radar-candidates';
import { ignoreRadarEvent, readSourceHost } from './radar-run-report';
import { extractRadarSourceText } from './radar-source-text';
import { loadRadarSettings } from './radar-settings';
import type { ProgramSourceMonitorResult, RadarRunReporter, RadarRunSlice } from './types';

export function collectProgramSourceUrls(
  programs: readonly Program[],
  documents: readonly KnowledgeDocument[] = [],
): string[] {
  const checkedPrograms = programs.filter(
    (program) =>
      program.jenis === 'program' && program.verifikasi !== 'belum' && program.tanggalDiperiksa,
  );
  const sourceUrls = [
    ...checkedPrograms.flatMap((program) => [
      program.sumberUtama.url,
      ...program.sumberTambahan.map((source) => source.url),
    ]),
    ...buildProgramKnowledge(checkedPrograms).map((passage) => passage.sourceUrl),
    ...buildCuratedKnowledge(documents, checkedPrograms).map((passage) => passage.sourceUrl),
  ];
  return [...new Set(sourceUrls)].filter(
    (sourceUrl) => sourceUrl.startsWith('https://') && isOfficialDomain(sourceUrl),
  );
}

export function collectProgramSourceTargets(
  programs: readonly Program[],
  documents: readonly KnowledgeDocument[] = [],
): Map<string, Program[]> {
  const checkedPrograms = programs.filter(
    (program) =>
      program.jenis === 'program' && program.verifikasi !== 'belum' && program.tanggalDiperiksa,
  );
  const programsById = new Map(checkedPrograms.map((program) => [program.id, program]));
  const targets = new Map<string, Map<string, Program>>();
  const addTarget = (sourceUrl: string, program: Program) => {
    if (!sourceUrl.startsWith('https://') || !isOfficialDomain(sourceUrl)) return;
    const matchingPrograms = targets.get(sourceUrl) ?? new Map<string, Program>();
    matchingPrograms.set(program.id, program);
    targets.set(sourceUrl, matchingPrograms);
  };

  for (const program of checkedPrograms) {
    addTarget(program.sumberUtama.url, program);
    for (const source of program.sumberTambahan) addTarget(source.url, program);
  }
  for (const passage of [
    ...buildProgramKnowledge(checkedPrograms),
    ...buildCuratedKnowledge(documents, checkedPrograms),
  ]) {
    const program = programsById.get(passage.programId);
    if (program) addTarget(passage.sourceUrl, program);
  }
  return new Map([...targets].map(([sourceUrl, matches]) => [sourceUrl, [...matches.values()]]));
}

export async function runProgramSourceMonitor(
  force = false,
  report: RadarRunReporter = ignoreRadarEvent,
  signal: AbortSignal = new AbortController().signal,
  slice?: RadarRunSlice,
): Promise<ProgramSourceMonitorResult> {
  const settings = await loadRadarSettings();
  if (!force && !settings.monitoring_enabled) return { checked: 0, changed: [], failed: [] };
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (process.env.DEMO_OFFLINE === 'true' || !url || !serviceRoleKey) {
    throw new Error('Program source monitoring is not configured');
  }

  const [programs, documents] = await Promise.all([loadPrograms(), loadKnowledgeDocuments()]);
  const sourceTargets = collectProgramSourceTargets(programs, documents);
  const sourceUrls = [...sourceTargets.keys()];
  if (sourceUrls.length === 0) throw new Error('No checked program sources are available');

  const client = createClient<Database>(url, serviceRoleKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
  const startIndex = slice?.startIndex ?? 0;
  const result: ProgramSourceMonitorResult = {
    checked: slice?.carry?.checked ?? 0,
    changed: [...(slice?.carry?.changed ?? [])],
    failed: [...(slice?.carry?.failed ?? [])],
    next: null,
  };
  let processed = startIndex;
  const reportSource = (sourceUrl: string, outcome: RadarSourceOutcome) => {
    processed += 1;
    report({
      type: 'source-checked',
      host: readSourceHost(sourceUrl),
      outcome,
      checked: processed,
      total: sourceUrls.length,
    });
  };
  if (startIndex === 0) report({ type: 'started', run: 'monitoring', total: sourceUrls.length });

  for (let offset = startIndex; offset < sourceUrls.length; offset += SOURCE_CHECK_BATCH_SIZE) {
    if (signal.aborted) break;
    if (slice && offset > startIndex && Date.now() >= slice.deadline) {
      result.next = {
        index: offset,
        seed: null,
        carry: {
          checked: result.checked,
          changed: [...result.changed],
          failed: [...result.failed],
        },
      };
      return result;
    }
    const batch = sourceUrls.slice(offset, offset + SOURCE_CHECK_BATCH_SIZE);
    await Promise.all(
      batch.map(async (sourceUrl) => {
        if (signal.aborted) return;
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
            reportSource(sourceUrl, previous.changed_at ? 'changed' : 'unchanged');
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
              source_text: current.html ? extractRadarSourceText(current.html) : null,
              content_updated_at: current.html ? checkedAt : null,
            });
            if (error) throw error;
            result.checked += 1;
            reportSource(sourceUrl, 'baseline');
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
              source_text: current.html
                ? extractRadarSourceText(current.html)
                : previous.source_text,
              content_updated_at: current.html ? checkedAt : previous.content_updated_at,
            })
            .eq('source_url', sourceUrl);
          if (error) throw error;
          result.checked += 1;
          if (hasChanged) {
            for (const program of sourceTargets.get(sourceUrl) ?? []) {
              await queueRadarCandidate(client, program, sourceUrl, current);
            }
            result.changed.push(sourceUrl);
          }
          reportSource(sourceUrl, hasChanged ? 'changed' : 'unchanged');
        } catch (error) {
          result.failed.push(sourceUrl);
          reportSource(sourceUrl, 'failed');
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
