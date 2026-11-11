import { Bell } from 'lucide-react';
import { ProgramCard } from '@/components/program/program-card';
import { FINDER_COPY as COPY } from './content';
import type { FinderResultCardProps } from './types';

const STATUS_LABELS = {
  dibuka: COPY.statusOpen,
  'belum-dibuka': COPY.statusUpcoming,
  ditutup: COPY.statusClosed,
} as const;

export function FinderResultCard({ recommendation }: FinderResultCardProps) {
  const status =
    recommendation.periodStatus in STATUS_LABELS
      ? STATUS_LABELS[recommendation.periodStatus as keyof typeof STATUS_LABELS]
      : null;

  return (
    <div className="flex min-w-0 [&>article]:h-full [&>article]:w-full">
      <ProgramCard program={recommendation.program}>
        <div className="mb-3 mt-3 border-t border-[#e7ecf2] pt-3 text-[13px] leading-[1.5] text-[#475569]">
          {status && (
            <div className="mb-2.5 flex items-center gap-1.5 text-xs font-semibold text-[#1769c2]">
              <Bell aria-hidden="true" size={15} />
              {status}
            </div>
          )}
          <div className="mb-1 font-semibold text-[#253044]">{COPY.whyHeading}</div>
          <ul className="m-0 grid list-disc gap-[3px] pl-[18px]">
            {recommendation.reasons.map((reason) => (
              <li key={reason}>{reason}</li>
            ))}
          </ul>
          {recommendation.checks.length > 0 && (
            <ul className="m-0 mt-2.5 grid list-none gap-[3px] border-t border-[#e7ecf2] p-0 pt-2.5 text-[#6d4a00]">
              {recommendation.checks.map((check) => (
                <li key={check}>
                  <strong>{COPY.checksLabel}:</strong> {check}
                </li>
              ))}
            </ul>
          )}
        </div>
      </ProgramCard>
    </div>
  );
}
