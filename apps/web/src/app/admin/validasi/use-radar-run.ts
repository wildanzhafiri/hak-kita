'use client';

import { useEffect, useRef, useState } from 'react';
import { usePathname } from 'next/navigation';
import type { RadarRunEvent, RadarRunKind } from '@hakkita/schema';
import { RADAR_CONTROLS_ENDPOINT, RADAR_RUNS_ENDPOINT } from './constants';
import { RADAR_RUN_COPY } from './content';
import { createRadarRunState, markRadarRunStopped, reduceRadarRun } from './radar-run';
import { readRadarRunEvents } from './radar-run-events';
import type { RadarRunHandle, RadarRunSnapshot, RadarRunState } from './types';

const RUN_ACTIONS = { discovery: 'run_discovery', monitoring: 'run_monitoring' } as const;
const ELAPSED_TICK_MS = 1000;
const POLL_INTERVAL_MS = 2000;
const MS_PER_SECOND = 1000;
const RUNS_UNAVAILABLE_CODE = 'runs-unavailable';

async function readRequestFailure(response: Response): Promise<string> {
  try {
    const result: unknown = await response.json();
    if (result && typeof result === 'object' && 'error' in result) {
      return typeof result.error === 'string' ? result.error : RADAR_RUN_COPY.requestFailedMessage;
    }
  } catch {
    return RADAR_RUN_COPY.requestFailedMessage;
  }
  return RADAR_RUN_COPY.requestFailedMessage;
}

function readSnapshot(value: unknown): RadarRunSnapshot | null {
  if (!value || typeof value !== 'object' || !('run' in value)) return null;
  const run = value.run;
  if (!run || typeof run !== 'object') return null;
  const { id, state, finishedAt } = run as Record<string, unknown>;
  if (typeof id !== 'string' || !state || typeof state !== 'object') return null;
  return {
    id,
    state: state as RadarRunState,
    finishedAt: typeof finishedAt === 'string' ? finishedAt : null,
  };
}

function createFailedRun(kind: RadarRunKind, message: string): RadarRunState {
  return reduceRadarRun(createRadarRunState(kind, Date.now()), { type: 'failed', message });
}

export function useRadarRun(): RadarRunHandle {
  const pathname = usePathname();
  const isAdminPage = pathname.startsWith('/admin');
  const [state, setState] = useState<RadarRunState | null>(null);
  const [runId, setRunId] = useState<string | null>(null);
  const [finishedElapsed, setFinishedElapsed] = useState<number | null>(null);
  const [tick, setTick] = useState(0);
  const abortController = useRef<AbortController | null>(null);
  const useServerRuns = useRef(true);
  const hasLoaded = useRef(false);
  const isStopRequested = useRef(false);
  const latestRequest = useRef(0);
  const isRunning = state?.status === 'running';
  const startedAt = state?.startedAt ?? 0;
  const elapsedSeconds =
    finishedElapsed ??
    (isRunning ? Math.max(0, Math.floor((tick - startedAt) / MS_PER_SECOND)) : 0);

  useEffect(() => {
    if (!isRunning) return;
    const timer = window.setInterval(() => setTick(Date.now()), ELAPSED_TICK_MS);
    return () => window.clearInterval(timer);
  }, [isRunning]);

  useEffect(() => () => abortController.current?.abort(), []);

  function applySnapshot(snapshot: RadarRunSnapshot) {
    if (isStopRequested.current && snapshot.state.status === 'running') return;
    if (snapshot.state.status !== 'running') isStopRequested.current = false;
    setRunId(snapshot.id);
    setState(snapshot.state);
    setFinishedElapsed(
      snapshot.finishedAt
        ? Math.max(
            0,
            Math.floor(
              (Date.parse(snapshot.finishedAt) - snapshot.state.startedAt) / MS_PER_SECOND,
            ),
          )
        : null,
    );
  }

  async function fetchLatest(): Promise<void> {
    latestRequest.current += 1;
    const requestId = latestRequest.current;
    try {
      const response = await fetch(RADAR_RUNS_ENDPOINT);
      const body: unknown = await response.json().catch(() => null);
      if (requestId !== latestRequest.current) return;
      if (
        response.status === 503 &&
        (body as { code?: string } | null)?.code === RUNS_UNAVAILABLE_CODE
      ) {
        useServerRuns.current = false;
        return;
      }
      if (!response.ok) return;
      const snapshot = readSnapshot(body);
      if (snapshot) applySnapshot(snapshot);
    } catch {
      return;
    }
  }

  useEffect(() => {
    if (!isAdminPage || hasLoaded.current) return;
    hasLoaded.current = true;
    void fetchLatest();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAdminPage]);

  useEffect(() => {
    if (!isAdminPage || !runId || !isRunning || !useServerRuns.current) return;
    const timer = window.setInterval(() => void fetchLatest(), POLL_INTERVAL_MS);
    return () => window.clearInterval(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAdminPage, runId, isRunning]);

  function applyEvent(event: RadarRunEvent) {
    setState((current) =>
      current && current.status !== 'stopped' ? reduceRadarRun(current, event) : current,
    );
  }

  async function startStreaming(kind: RadarRunKind) {
    abortController.current?.abort();
    const controller = new AbortController();
    abortController.current = controller;
    setRunId(null);
    setFinishedElapsed(null);
    setTick(Date.now());
    setState(createRadarRunState(kind, Date.now()));
    try {
      const response = await fetch(RADAR_CONTROLS_ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: RUN_ACTIONS[kind] }),
        signal: controller.signal,
      });
      if (!response.ok || !response.body) {
        applyEvent({ type: 'failed', message: await readRequestFailure(response) });
        return;
      }
      let hasEnded = false;
      await readRadarRunEvents(response.body, (event) => {
        if (event.type === 'finished' || event.type === 'failed') hasEnded = true;
        applyEvent(event);
      });
      if (!hasEnded) applyEvent({ type: 'failed', message: RADAR_RUN_COPY.streamEndedMessage });
    } catch {
      if (controller.signal.aborted) return;
      applyEvent({ type: 'failed', message: RADAR_RUN_COPY.streamEndedMessage });
    }
  }

  async function start(kind: RadarRunKind) {
    if (!useServerRuns.current) return startStreaming(kind);
    isStopRequested.current = false;
    latestRequest.current += 1;
    try {
      const response = await fetch(RADAR_RUNS_ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ kind }),
      });
      const body: unknown = await response.json().catch(() => null);
      if (
        response.status === 503 &&
        (body as { code?: string } | null)?.code === RUNS_UNAVAILABLE_CODE
      ) {
        useServerRuns.current = false;
        return startStreaming(kind);
      }
      if (response.status === 409) {
        await fetchLatest();
        return;
      }
      const snapshot = readSnapshot(body);
      if (!response.ok || !snapshot) {
        setState(
          createFailedRun(
            kind,
            body && typeof body === 'object' && 'error' in body && typeof body.error === 'string'
              ? body.error
              : RADAR_RUN_COPY.requestFailedMessage,
          ),
        );
        return;
      }
      setTick(Date.now());
      applySnapshot(snapshot);
    } catch {
      setState(createFailedRun(kind, RADAR_RUN_COPY.requestFailedMessage));
    }
  }

  function stop() {
    if (runId && useServerRuns.current) {
      isStopRequested.current = true;
      void fetch(`${RADAR_RUNS_ENDPOINT}/${runId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'stop' }),
      }).catch(() => undefined);
    } else {
      abortController.current?.abort();
    }
    setState((current) => (current ? markRadarRunStopped(current) : current));
  }

  function dismiss() {
    latestRequest.current += 1;
    if (runId && useServerRuns.current && state?.status !== 'running') {
      void fetch(`${RADAR_RUNS_ENDPOINT}/${runId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'dismiss' }),
      }).catch(() => undefined);
    }
    setRunId(null);
    setFinishedElapsed(null);
    setState(null);
  }

  return { state, elapsedSeconds, start, stop, dismiss };
}
