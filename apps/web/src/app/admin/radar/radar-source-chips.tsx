import { Globe } from 'lucide-react';
import { RADAR_SOURCE_CLASSES } from './constants';
import { RADAR_RUN_COPY } from './content';
import type { RadarSourceChipsProps } from './types';

const TONE_SUFFIX = { read: '', same: '', changed: 'berubah', failed: 'gagal' } as const;

export function RadarSourceChips({ sources, isWorking }: RadarSourceChipsProps) {
  if (sources.length === 0) return null;
  return (
    <ul aria-label={RADAR_RUN_COPY.sourcesLabel} className="mt-2 flex flex-wrap gap-1.5">
      {sources.map((source) => (
        <li
          key={source.host}
          className={`inline-flex max-w-full animate-agent-chip items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs leading-4 ${RADAR_SOURCE_CLASSES[source.tone]}`}
        >
          <Globe aria-hidden="true" size={12} className="shrink-0" />
          <span className="min-w-0 truncate">{source.host}</span>
          {TONE_SUFFIX[source.tone] && (
            <span className="shrink-0 font-semibold">{TONE_SUFFIX[source.tone]}</span>
          )}
        </li>
      ))}
      {isWorking && (
        <li
          aria-hidden="true"
          className="inline-flex items-center rounded-full border border-dashed border-[#c7dbf2] px-2.5 py-1 text-xs leading-4 text-[#8a99ad]"
        >
          membuka sumber…
        </li>
      )}
    </ul>
  );
}
