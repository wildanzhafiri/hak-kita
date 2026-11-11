import { ProgramCard } from '@/components/program/program-card';
import { RECOMMENDATION_COPY as COPY } from './content';
import type { RecommendationCardProps } from './types';

export function RecommendationCard({ recommendation }: RecommendationCardProps) {
  return (
    <div className="flex min-w-0 flex-col gap-3 [&>article]:h-full">
      <ProgramCard program={recommendation.program} />
      <div className="rounded-xl border border-[#e1e9f2] bg-[#f5f8fc] p-4">
        <span className="inline-flex rounded-full bg-[#edf5ff] px-2.5 py-1 text-xs font-semibold text-[#1769c2]">
          {COPY.potential}
        </span>
        <ul className="m-0 mt-3 list-disc space-y-1.5 pl-5 text-[13px] leading-5 text-[#435570]">
          {recommendation.reasons.map((reason) => (
            <li key={reason}>{reason}</li>
          ))}
        </ul>
        {recommendation.checks.length > 0 && (
          <ul className="m-0 mt-3 list-none space-y-1.5 border-t border-[#e1e9f2] p-0 pt-3 text-[13px] leading-5 text-[#6d4a00]">
            {recommendation.checks.map((check) => (
              <li key={check}>
                <strong>{COPY.checksLabel}:</strong> {check}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
