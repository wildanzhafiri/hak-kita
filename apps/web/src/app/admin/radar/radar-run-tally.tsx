import { RADAR_RUN_COPY } from './content';
import type { RadarRunTallyProps } from './types';

export function RadarRunTally({ kind, tally }: RadarRunTallyProps) {
  const labels = RADAR_RUN_COPY.tally[kind];
  const entries = [
    { key: 'examined', value: tally.examined, label: labels.examined },
    { key: 'flagged', value: tally.flagged, label: labels.flagged },
    { key: 'setAside', value: tally.setAside, label: labels.setAside },
  ] as const;
  return (
    <dl className="flex flex-wrap gap-x-8 gap-y-3">
      {entries.map((entry) => (
        <div key={entry.key} className="flex flex-col-reverse">
          <dt className="text-xs text-[#64748b]">{entry.label}</dt>
          <dd
            className={`text-2xl leading-8 font-semibold tabular-nums ${
              entry.key === 'flagged' && entry.value > 0 ? 'text-[#c25f1f]' : 'text-[#253044]'
            }`}
          >
            {entry.value}
          </dd>
        </div>
      ))}
    </dl>
  );
}
