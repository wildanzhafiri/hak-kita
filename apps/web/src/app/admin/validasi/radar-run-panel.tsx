import { RefreshCw, Square, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { RADAR_RUN_COPY } from './content';
import { RadarAgentList } from './radar-agent-list';
import { RadarRoundResults } from './radar-round-results';
import { formatElapsed, readRunHeadline, readRunTitle } from './radar-run-copy';
import { RadarRunProgress } from './radar-run-progress';
import { RadarRunTally } from './radar-run-tally';
import { RadarWorkingLabel } from './radar-working-label';
import type { RadarRunPanelProps } from './types';

export function RadarRunPanel({ state, elapsedSeconds, onDismiss, onStop }: RadarRunPanelProps) {
  const { headline, detail } = readRunHeadline(state);
  const isRunning = state.status === 'running';
  const hasRounds = !isRunning && state.rounds.length > 0;
  const canReload =
    (state.status === 'done' || state.status === 'stopped') && state.tally.flagged > 0;

  return (
    <section
      aria-label={readRunTitle(state)}
      className="mt-5 grid gap-5 border-t border-[#e6edf5] pt-5"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <h3 className="text-sm font-medium text-[#64748b]">{readRunTitle(state)}</h3>
          <p aria-live="polite" className="mt-1 text-xl leading-7 font-semibold text-[#253044]">
            <RadarWorkingLabel isWorking={isRunning}>{headline}</RadarWorkingLabel>
          </p>
          <p className="mt-1 text-sm leading-6 [overflow-wrap:anywhere] text-[#526173]">{detail}</p>
        </div>
        <div className="flex shrink-0 items-center gap-1">
          <span className="text-sm text-[#64748b] tabular-nums">
            {formatElapsed(elapsedSeconds)}
          </span>
          {isRunning ? (
            <Button
              className="ml-2 min-h-9 px-3 text-sm"
              tone="danger-outline"
              type="button"
              onPress={onStop}
            >
              <Square aria-hidden="true" size={14} fill="currentColor" />
              {RADAR_RUN_COPY.stopLabel}
            </Button>
          ) : (
            <Button
              tone="icon"
              type="button"
              aria-label={RADAR_RUN_COPY.dismissLabel}
              onPress={onDismiss}
            >
              <X size={18} />
            </Button>
          )}
        </div>
      </div>
      <RadarRunProgress state={state} />
      {hasRounds ? <RadarRoundResults rounds={state.rounds} /> : <RadarAgentList state={state} />}
      <RadarRunTally kind={state.kind} tally={state.tally} />
      {canReload && (
        <div>
          <Button tone="secondary" type="button" onPress={() => window.location.reload()}>
            <RefreshCw size={16} />
            {RADAR_RUN_COPY.reloadLabel}
          </Button>
        </div>
      )}
    </section>
  );
}
