import { RADAR_TONE_CLASSES, RADAR_TONE_ICONS } from './constants';
import { RADAR_RUN_COPY } from './content';
import type { RadarRoundResultsProps } from './types';

export function RadarRoundResults({ rounds }: RadarRoundResultsProps) {
  if (rounds.length === 0) return null;
  return (
    <div>
      <h4 className="text-sm font-semibold text-[#253044]">{RADAR_RUN_COPY.roundsHeading}</h4>
      <ol className="mt-2 grid gap-2">
        {rounds.map((round) => {
          const Icon = RADAR_TONE_ICONS[round.tone];
          return (
            <li key={round.index} className="flex items-start gap-2 text-sm leading-6">
              <Icon
                aria-hidden="true"
                size={18}
                className={`mt-[3px] shrink-0 ${RADAR_TONE_CLASSES[round.tone]}`}
              />
              <span className="min-w-0 [overflow-wrap:anywhere] text-[#46566b]">
                <span className="font-medium text-[#253044]">{round.label}.</span>
                {` ${round.text}`}
              </span>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
