import { RADAR_DISCOVERY_PHASES } from './constants';
import { RADAR_RUN_COPY } from './content';
import { RadarAgentStep } from './radar-agent-step';
import { RadarSourceChips } from './radar-source-chips';
import type { RadarAgentListProps, RadarAgentState, RadarRunStatus } from './types';

const MONITOR_STATUSES: Record<RadarRunStatus, RadarAgentState['status']> = {
  running: 'working',
  done: 'done',
  failed: 'failed',
  stopped: 'skipped',
};

export function RadarAgentList({ state }: RadarAgentListProps) {
  const isRunning = state.status === 'running';

  if (state.kind === 'monitoring') {
    const monitor: RadarAgentState = {
      status: MONITOR_STATUSES[state.status],
      note: state.currentSource && isRunning ? `Memeriksa ${state.currentSource}` : null,
    };
    return (
      <ol aria-label={RADAR_RUN_COPY.agentListLabel}>
        <RadarAgentStep phase="monitor" agent={monitor} isLast>
          <RadarSourceChips sources={state.sources} isWorking={false} />
        </RadarAgentStep>
      </ol>
    );
  }

  return (
    <ol aria-label={RADAR_RUN_COPY.agentListLabel}>
      {RADAR_DISCOVERY_PHASES.map((phase, index) => (
        <RadarAgentStep
          key={phase}
          phase={phase}
          agent={state.agents[phase]}
          isLast={index === RADAR_DISCOVERY_PHASES.length - 1}
        >
          {phase === 'draft' && (
            <RadarSourceChips
              sources={state.sources}
              isWorking={isRunning && state.agents.draft.status === 'working'}
            />
          )}
        </RadarAgentStep>
      ))}
    </ol>
  );
}
