import type { RadarRunEvent, RadarRunKind, RadarSkipReason } from '@hakkita/schema';
import { MAX_RADAR_SOURCES, RADAR_DISCOVERY_PHASES } from './constants';
import {
  formatReadNote,
  formatSearchedNote,
  formatSkipReason,
  formatSourcesNote,
} from './radar-run-copy';
import type {
  RadarAgentStatus,
  RadarAgents,
  RadarOutcomeEvent,
  RadarRoundResult,
  RadarRunPhase,
  RadarRunState,
  RadarSourceChip,
  RadarSourceTone,
} from './types';

const PERCENT = 100;

const SOURCE_TONES = {
  unchanged: 'same',
  baseline: 'same',
  changed: 'changed',
  failed: 'failed',
} as const satisfies Record<string, RadarSourceTone>;

const REASON_PHASES: Record<Exclude<RadarSkipReason, 'error'>, RadarRunPhase> = {
  'search-repeated': 'search',
  'no-pages': 'read',
  'ai-not-configured': 'draft',
  'insufficient-evidence': 'draft',
  'unknown-region': 'check',
  'already-listed': 'check',
  'already-queued': 'check',
};

function createAgents(): RadarAgents {
  const waiting = { status: 'waiting', note: null } as const;
  return { search: waiting, read: waiting, draft: waiting, check: waiting };
}

export function createRadarRunState(kind: RadarRunKind, startedAt: number): RadarRunState {
  return {
    kind,
    status: 'running',
    startedAt,
    phase: null,
    round: null,
    progress: { done: 0, total: 0 },
    currentSource: null,
    tally: { examined: 0, flagged: 0, setAside: 0 },
    agents: createAgents(),
    sources: [],
    rounds: [],
    summary: null,
    failure: null,
  };
}

export function readProgressPercent(state: RadarRunState): number {
  if (state.status === 'done') return PERCENT;
  if (state.progress.total === 0) return 0;
  return Math.min(PERCENT, Math.round((state.progress.done / state.progress.total) * PERCENT));
}

function withAgent(
  state: RadarRunState,
  phase: RadarRunPhase,
  status: RadarAgentStatus,
  note: string | null,
): RadarRunState {
  return { ...state, agents: { ...state.agents, [phase]: { status, note } } };
}

function withSource(state: RadarRunState, chip: RadarSourceChip): RadarSourceChip[] {
  const others = state.sources.filter((source) => source.host !== chip.host);
  return [...others, chip].slice(-MAX_RADAR_SOURCES);
}

function findWorkingPhase(state: RadarRunState): RadarRunPhase {
  const working = [...RADAR_DISCOVERY_PHASES]
    .reverse()
    .find((phase) => state.agents[phase].status === 'working');
  return working ?? state.phase ?? 'search';
}

function applyOutcome(state: RadarRunState, event: RadarOutcomeEvent): RadarRunState {
  if (event.result === 'queued') {
    return withAgent(
      state,
      'check',
      'done',
      `Draf siap ditinjau: ${event.name ?? 'program tanpa nama'}.`,
    );
  }
  const reason = event.reason ?? 'error';
  const phase = reason === 'error' ? findWorkingPhase(state) : REASON_PHASES[reason];
  const status = reason === 'error' ? 'failed' : 'skipped';
  return withAgent(state, phase, status, formatSkipReason(reason, event.name, event.detail));
}

function recordRound(state: RadarRunState, event: RadarOutcomeEvent): RadarRunState {
  const label = state.round?.label ?? '';
  const result: RadarRoundResult =
    event.result === 'queued'
      ? {
          index: event.index,
          label,
          tone: 'success',
          text: `Kandidat baru: ${event.name ?? 'program tanpa nama'}.`,
        }
      : {
          index: event.index,
          label,
          tone: event.reason === 'error' ? 'error' : 'warning',
          text: formatSkipReason(event.reason ?? 'error', event.name, event.detail),
        };
  return { ...state, rounds: [...state.rounds, result] };
}

export function markRadarRunStopped(state: RadarRunState): RadarRunState {
  if (state.status !== 'running') return state;
  return { ...state, status: 'stopped', currentSource: null };
}

export function reduceRadarRun(state: RadarRunState, event: RadarRunEvent): RadarRunState {
  switch (event.type) {
    case 'started':
      return {
        ...state,
        phase: event.run === 'monitoring' ? 'check' : null,
        progress: { done: 0, total: event.total },
      };
    case 'round':
      return withAgent(
        {
          ...state,
          phase: 'search',
          currentSource: null,
          agents: createAgents(),
          sources: [],
          round: { index: event.index, total: event.total, label: event.label },
          progress: { done: event.index, total: event.total },
        },
        'search',
        'working',
        null,
      );
    case 'searched':
      return withAgent(
        withAgent(
          { ...state, phase: 'read' },
          'search',
          'done',
          formatSearchedNote(event.found, event.usedRegisteredSources),
        ),
        'read',
        'working',
        null,
      );
    case 'read':
      return withAgent(
        { ...state, tally: { ...state.tally, examined: state.tally.examined + event.readable } },
        'read',
        event.readable > 0 ? 'done' : 'failed',
        formatReadNote(event.readable),
      );
    case 'drafting':
      return withAgent({ ...state, phase: 'draft' }, 'draft', 'working', null);
    case 'source-opened':
      return {
        ...state,
        currentSource: event.host,
        sources: withSource(state, { host: event.host, tone: 'read' }),
      };
    case 'checking':
      return withAgent(
        withAgent(
          { ...state, phase: 'check', currentSource: null },
          'draft',
          'done',
          formatSourcesNote(state.sources.length),
        ),
        'check',
        'working',
        null,
      );
    case 'outcome': {
      const isQueued = event.result === 'queued';
      const next = applyOutcome(
        {
          ...state,
          currentSource: null,
          progress: { ...state.progress, done: event.index + 1 },
          tally: {
            ...state.tally,
            flagged: state.tally.flagged + (isQueued ? 1 : 0),
            setAside: state.tally.setAside + (isQueued ? 0 : 1),
          },
        },
        event,
      );
      return recordRound(next, event);
    }
    case 'source-checked':
      return {
        ...state,
        phase: 'check',
        currentSource: event.host,
        progress: { done: event.checked, total: event.total },
        sources: withSource(state, { host: event.host, tone: SOURCE_TONES[event.outcome] }),
        tally: {
          examined: state.tally.examined + 1,
          flagged: state.tally.flagged + (event.outcome === 'changed' ? 1 : 0),
          setAside: state.tally.setAside + (event.outcome === 'failed' ? 1 : 0),
        },
      };
    case 'finished':
      return {
        ...state,
        status: 'done',
        phase: null,
        currentSource: null,
        summary: event.summary,
        progress: { ...state.progress, done: state.progress.total },
      };
    case 'failed':
      return { ...state, status: 'failed', currentSource: null, failure: event.message };
  }
}
