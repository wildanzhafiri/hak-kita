import { Check, CircleX, TriangleAlert } from 'lucide-react';
import {
  RADAR_AGENT_BADGE_CLASSES,
  RADAR_AGENT_ICONS,
  RADAR_AGENT_RAIL_CLASSES,
} from './constants';
import { RADAR_RUN_COPY } from './content';
import type { RadarAgentStepProps } from './types';

const STATUS_ICONS = { done: Check, skipped: TriangleAlert, failed: CircleX } as const;

export function RadarAgentStep({ phase, agent, isLast, children }: RadarAgentStepProps) {
  const Icon = RADAR_AGENT_ICONS[phase];
  const StatusIcon =
    agent.status in STATUS_ICONS ? STATUS_ICONS[agent.status as keyof typeof STATUS_ICONS] : null;
  const isWorking = agent.status === 'working';
  const note = agent.note ?? (agent.status === 'waiting' ? RADAR_RUN_COPY.waitingNote : null);

  return (
    <li className="relative flex gap-3 pb-4 last:pb-0">
      {!isLast && (
        <span
          aria-hidden="true"
          className={`absolute top-10 bottom-0 left-[17px] w-0.5 ${RADAR_AGENT_RAIL_CLASSES[agent.status]}`}
        />
      )}
      <span className="relative size-9 shrink-0 self-start">
        {isWorking && (
          <span
            aria-hidden="true"
            className="absolute inset-0 animate-agent-pulse rounded-xl bg-[#196dcc]"
          />
        )}
        <span
          className={`relative grid size-9 place-items-center rounded-xl border ${RADAR_AGENT_BADGE_CLASSES[agent.status]}`}
        >
          <Icon aria-hidden="true" size={18} />
        </span>
      </span>
      <div className="min-w-0 flex-1 pt-0.5">
        <p className="flex flex-wrap items-center gap-x-2 text-sm leading-6">
          <span
            className={`font-semibold ${agent.status === 'waiting' ? 'text-[#8a99ad]' : 'text-[#253044]'}`}
          >
            {RADAR_RUN_COPY.agents[phase].name}
          </span>
          <span className="inline-flex items-center gap-1 text-xs text-[#64748b]">
            {StatusIcon && <StatusIcon aria-hidden="true" size={13} />}
            {RADAR_RUN_COPY.agentStatus[agent.status]}
          </span>
        </p>
        {(note ?? (isWorking ? RADAR_RUN_COPY.agents[phase].detail : null)) ? (
          <p
            className={`text-sm leading-6 [overflow-wrap:anywhere] ${agent.status === 'waiting' ? 'text-[#98a6b8]' : 'text-[#46566b]'}`}
          >
            {note ?? RADAR_RUN_COPY.agents[phase].detail}
          </p>
        ) : null}
        {children}
      </div>
    </li>
  );
}
