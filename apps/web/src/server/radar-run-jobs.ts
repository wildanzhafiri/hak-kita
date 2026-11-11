import 'server-only';
import { createClient } from '@supabase/supabase-js';
import type { SupabaseClient } from '@supabase/supabase-js';
import type { RadarRunEvent, RadarRunKind } from '@hakkita/schema';
import {
  createRadarRunState,
  markRadarRunStopped,
  reduceRadarRun,
} from '@/app/admin/validasi/radar-run';
import type { RadarRunSnapshot, RadarRunState } from '@/app/admin/validasi/types';
import type { Database } from '@/lib/supabase/types';
import {
  RADAR_RUN_ABANDONED_MS,
  RADAR_RUN_CONTINUE_TIMEOUT_MS,
  RADAR_RUN_FAILURE_MESSAGE,
  RADAR_RUN_HEARTBEAT_MS,
  RADAR_RUN_HISTORY_MS,
  RADAR_RUN_LEASE_MS,
  RADAR_RUN_RESUME_AFTER_MS,
  RADAR_RUN_SAVE_INTERVAL_MS,
  RADAR_RUN_SLICE_MS,
} from './constants';
import { runProgramSourceMonitor } from './program-source-monitor';
import { runProgramDiscovery } from './radar-program-discovery';
import type {
  ProgramDiscoveryResult,
  ProgramSourceMonitorResult,
  RadarRunCursor,
  RadarRunSlice,
} from './types';

export const RADAR_RUN_ERRORS = {
  unavailable: 'RADAR_RUNS_UNAVAILABLE',
  alreadyRunning: 'RADAR_RUN_ALREADY_RUNNING',
} as const;

const MISSING_TABLE_CODES = new Set(['42P01', 'PGRST205']);

type RunClient = SupabaseClient<Database>;

function createRunClient(): RunClient {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) throw new Error(RADAR_RUN_ERRORS.unavailable);
  return createClient<Database>(url, key, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
}

function rethrow(error: { code?: string }): never {
  if (error.code && MISSING_TABLE_CODES.has(error.code)) {
    throw new Error(RADAR_RUN_ERRORS.unavailable);
  }
  throw error;
}

function isoFromNow(offsetMs: number): string {
  return new Date(Date.now() + offsetMs).toISOString();
}

function failedState(state: RadarRunState, message: string): RadarRunState {
  return reduceRadarRun(state, { type: 'failed', message });
}

function describeDiscovery(result: ProgramDiscoveryResult): string {
  const failedNote = result.failed.length > 0 ? `, ${result.failed.length} gagal` : '';
  return `Pencarian selesai: ${result.searched} pencarian dan ${result.queued} kandidat baru${failedNote}.`;
}

function describeMonitoring(result: ProgramSourceMonitorResult): string {
  return `Pemeriksaan selesai: ${result.checked} sumber diperiksa, ${result.changed.length} berubah, ${result.failed.length} gagal.`;
}

async function closeAbandonedRuns(client: RunClient): Promise<void> {
  const { error } = await client
    .from('program_radar_runs')
    .update({ status: 'failed', lease_until: null, finished_at: new Date().toISOString() })
    .eq('status', 'running')
    .lt('updated_at', isoFromNow(-RADAR_RUN_ABANDONED_MS));
  if (error) rethrow(error);
}

export async function startRadarRun(
  kind: RadarRunKind,
  adminId: string,
): Promise<{ id: string; state: RadarRunState }> {
  const client = createRunClient();
  await closeAbandonedRuns(client);

  const { data: active, error: activeError } = await client
    .from('program_radar_runs')
    .select('id')
    .eq('status', 'running')
    .limit(1);
  if (activeError) rethrow(activeError);
  if (active.length > 0) throw new Error(RADAR_RUN_ERRORS.alreadyRunning);

  const state = createRadarRunState(kind, Date.now());
  const { data, error } = await client
    .from('program_radar_runs')
    .insert({ kind, state, started_by: adminId })
    .select('id')
    .single();
  if (error) rethrow(error);
  return { id: data.id, state };
}

async function claimRadarRun(client: RunClient, runId: string) {
  const now = new Date().toISOString();
  const patch = { lease_until: isoFromNow(RADAR_RUN_LEASE_MS), updated_at: now };
  const free = await client
    .from('program_radar_runs')
    .update(patch)
    .eq('id', runId)
    .eq('status', 'running')
    .is('lease_until', null)
    .select('*')
    .maybeSingle();
  if (free.error) rethrow(free.error);
  if (free.data) return free.data;
  const expired = await client
    .from('program_radar_runs')
    .update(patch)
    .eq('id', runId)
    .eq('status', 'running')
    .lt('lease_until', now)
    .select('*')
    .maybeSingle();
  if (expired.error) rethrow(expired.error);
  return expired.data;
}

async function continueRadarRun(origin: string, runId: string): Promise<void> {
  const secret = process.env.CRON_SECRET;
  if (!secret) return;
  try {
    await fetch(new URL(`/api/admin/radar/runs/${runId}/continue`, origin), {
      method: 'POST',
      headers: { authorization: `Bearer ${secret}` },
      signal: AbortSignal.timeout(RADAR_RUN_CONTINUE_TIMEOUT_MS),
    });
  } catch {
    return;
  }
}

export async function runRadarSlice(runId: string, origin: string): Promise<void> {
  const client = createRunClient();
  const row = await claimRadarRun(client, runId);
  if (!row) return;

  const kind = row.kind;
  const controller = new AbortController();
  const cursor = row.cursor;
  const slice: RadarRunSlice = {
    startIndex: cursor?.index ?? 0,
    seed: cursor?.seed ?? null,
    carry: cursor?.carry,
    deadline: Date.now() + RADAR_RUN_SLICE_MS,
  };
  let state = row.state;
  let next: RadarRunCursor | null = null;
  let lastSavedAt = 0;
  let isSaving = false;

  async function save(): Promise<void> {
    if (isSaving) return;
    isSaving = true;
    try {
      const isFinished = state.status !== 'running';
      const isHolding = state.status === 'running' && !next;
      const { data } = await client
        .from('program_radar_runs')
        .update({
          state,
          status: state.status,
          cursor: next,
          lease_until: isHolding ? isoFromNow(RADAR_RUN_LEASE_MS) : null,
          updated_at: new Date().toISOString(),
          ...(isFinished ? { finished_at: new Date().toISOString() } : {}),
        })
        .eq('id', runId)
        .select('stop_requested')
        .single();
      lastSavedAt = Date.now();
      if (data?.stop_requested) controller.abort();
    } catch {
      lastSavedAt = Date.now();
    } finally {
      isSaving = false;
    }
  }

  const report = (event: RadarRunEvent) => {
    state = reduceRadarRun(state, event);
    if (Date.now() - lastSavedAt >= RADAR_RUN_SAVE_INTERVAL_MS) void save();
  };
  const heartbeat = setInterval(() => void save(), RADAR_RUN_HEARTBEAT_MS);

  try {
    const result =
      kind === 'discovery'
        ? await runProgramDiscovery(true, report, controller.signal, slice)
        : await runProgramSourceMonitor(true, report, controller.signal, slice);
    if (controller.signal.aborted) state = markRadarRunStopped(state);
    else if (result.next) next = result.next;
    else {
      const summary =
        kind === 'discovery'
          ? describeDiscovery(result as ProgramDiscoveryResult)
          : describeMonitoring(result as ProgramSourceMonitorResult);
      report({ type: 'finished', summary });
    }
  } catch {
    if (controller.signal.aborted) state = markRadarRunStopped(state);
    else state = failedState(state, RADAR_RUN_FAILURE_MESSAGE);
  } finally {
    clearInterval(heartbeat);
  }
  while (isSaving) await new Promise((resolve) => setTimeout(resolve, 50));
  await save();
  if (next && state.status === 'running') await continueRadarRun(origin, runId);
}

export async function loadLatestRadarRun(): Promise<{
  snapshot: RadarRunSnapshot;
  isResumable: boolean;
} | null> {
  const client = createRunClient();
  await closeAbandonedRuns(client);
  const { data, error } = await client
    .from('program_radar_runs')
    .select('*')
    .gte('started_at', new Date(Date.now() - RADAR_RUN_HISTORY_MS).toISOString())
    .order('started_at', { ascending: false })
    .limit(1);
  if (error) rethrow(error);
  const run = data[0];
  if (!run || run.dismissed) return null;

  let state = run.state;
  let finishedAt = run.finished_at;
  if (run.status === 'failed' && state.status === 'running') {
    state = failedState(state, RADAR_RUN_FAILURE_MESSAGE);
    finishedAt ??= new Date().toISOString();
    await client.from('program_radar_runs').update({ state }).eq('id', run.id);
  }
  const isLeaseFree = !run.lease_until || run.lease_until < new Date().toISOString();
  const isResumable =
    run.status === 'running' &&
    isLeaseFree &&
    run.updated_at < isoFromNow(-RADAR_RUN_RESUME_AFTER_MS);
  return { snapshot: { id: run.id, state, finishedAt }, isResumable };
}

export async function requestRadarRunStop(runId: string): Promise<void> {
  const client = createRunClient();
  const { data, error } = await client
    .from('program_radar_runs')
    .update({ stop_requested: true })
    .eq('id', runId)
    .eq('status', 'running')
    .select('state,lease_until')
    .maybeSingle();
  if (error) rethrow(error);
  if (!data) return;
  const isLeaseFree = !data.lease_until || data.lease_until < new Date().toISOString();
  if (!isLeaseFree) return;
  const { error: stopError } = await client
    .from('program_radar_runs')
    .update({
      status: 'stopped',
      state: markRadarRunStopped(data.state),
      cursor: null,
      lease_until: null,
      finished_at: new Date().toISOString(),
    })
    .eq('id', runId)
    .eq('status', 'running');
  if (stopError) rethrow(stopError);
}

export async function dismissRadarRun(runId: string): Promise<void> {
  const { error } = await createRunClient()
    .from('program_radar_runs')
    .update({ dismissed: true })
    .eq('id', runId)
    .neq('status', 'running');
  if (error) rethrow(error);
}
