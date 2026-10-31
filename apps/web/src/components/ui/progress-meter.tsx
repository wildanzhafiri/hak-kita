import { MAX_PROGRESS_SEGMENTS } from './constants';
import type { ProgressMeterProps } from './types';

export function ProgressMeter({ value, max, summary, label }: ProgressMeterProps) {
  const percent = max === 0 ? 0 : Math.round((value / max) * 100);
  const segmented = max > 0 && max <= MAX_PROGRESS_SEGMENTS;

  return (
    <>
      <div className="wizard-progress">
        <span>{summary}</span>
        <span>{percent}%</span>
      </div>
      <div
        className={segmented ? 'progress-track segmented' : 'progress-track'}
        role="progressbar"
        aria-label={label}
        aria-valuemin={0}
        aria-valuemax={max}
        aria-valuenow={value}
      >
        {segmented ? (
          Array.from({ length: max }, (_, i) => (
            <span key={i} className={i < value ? 'filled' : undefined} />
          ))
        ) : (
          <span style={{ width: `${percent}%` }} />
        )}
      </div>
    </>
  );
}
