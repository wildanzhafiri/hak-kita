'use client';

import { useEffect, useRef, useState } from 'react';
import type { RadarRunEvent, RadarRunKind } from '@hakkita/schema';
import { RADAR_CONTROLS_ENDPOINT } from './constants';
import { RADAR_RUN_COPY } from './content';
import { createRadarRunState, markRadarRunStopped, reduceRadarRun } from './radar-run';
import { readRadarRunEvents } from './radar-run-events';
import type { RadarRunHandle, RadarRunState } from './types';

const RUN_ACTIONS = { discovery: 'run_discovery', monitoring: 'run_monitoring' } as const;
const ELAPSED_TICK_MS = 1000;
const MS_PER_SECOND = 1000;

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

export function useRadarRun(): RadarRunHandle {
  const [state, setState] = useState<RadarRunState | null>(null);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const abortController = useRef<AbortController | null>(null);
  const isRunning = state?.status === 'running';
  const startedAt = state?.startedAt ?? 0;

  useEffect(() => {
    if (!isRunning) return;
    const timer = window.setInterval(() => {
      setElapsedSeconds(Math.floor((Date.now() - startedAt) / MS_PER_SECOND));
    }, ELAPSED_TICK_MS);
    return () => window.clearInterval(timer);
  }, [isRunning, startedAt]);

  useEffect(() => () => abortController.current?.abort(), []);

  function applyEvent(event: RadarRunEvent) {
    setState((current) =>
      current && current.status !== 'stopped' ? reduceRadarRun(current, event) : current,
    );
  }

  async function start(kind: RadarRunKind) {
    abortController.current?.abort();
    const controller = new AbortController();
    abortController.current = controller;
    setElapsedSeconds(0);
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

  function stop() {
    abortController.current?.abort();
    setState((current) => (current ? markRadarRunStopped(current) : current));
  }

  function dismiss() {
    setState(null);
  }

  return { state, elapsedSeconds, start, stop, dismiss };
}
