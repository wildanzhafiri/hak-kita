import { readProgressPercent } from './radar-run';
import { formatProgressLabel } from './radar-run-copy';
import type { RadarRunProgressProps } from './types';

const PROGRESS_BAR_CLASSES = {
  running: 'bg-[#196dcc]',
  done: 'bg-[#196dcc]',
  failed: 'bg-[#b72f35]',
  stopped: 'bg-[#8a99ad]',
} as const;

export function RadarRunProgress({ state }: RadarRunProgressProps) {
  const percent = readProgressPercent(state);
  const label = formatProgressLabel(state);
  return (
    <div>
      <p className="text-sm text-[#526173]">{label}</p>
      <div
        role="progressbar"
        aria-label={label}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={percent}
        className="mt-2 h-1.5 overflow-hidden rounded-full bg-[#e6eef8]"
      >
        <div
          className={`h-full rounded-full transition-[width] duration-500 motion-reduce:transition-none ${
            PROGRESS_BAR_CLASSES[state.status]
          }`}
          style={{ width: `${percent}%` }}
        />
      </div>
    </div>
  );
}
