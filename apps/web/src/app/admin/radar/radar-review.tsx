'use client';

import { useState } from 'react';
import { Radio } from 'lucide-react';
import { RadarCandidateCard } from './radar-candidate-card';
import { RadarProgramCandidates } from './radar-program-candidates';
import { RadarControls } from './radar-controls';
import { RadarEmailPreview } from './radar-email-preview';
import type { RadarReviewProps } from './types';

export function RadarReview({
  initialCandidates,
  initialProgramCandidates,
  initialSettings,
}: RadarReviewProps) {
  const [candidates, setCandidates] = useState(initialCandidates);
  const [emailNewsId, setEmailNewsId] = useState<string | null>(null);

  return (
    <div>
      <RadarControls initialSettings={initialSettings} />
      {emailNewsId && (
        <RadarEmailPreview newsId={emailNewsId} onDismiss={() => setEmailNewsId(null)} />
      )}
      {candidates.length === 0 ? (
        <div className="flex min-h-[210px] items-center gap-5 rounded-xl border border-[#dce4ed] bg-white px-6 py-8 sm:px-9">
          <span className="grid size-12 shrink-0 place-items-center rounded-xl bg-[#eef5fc] text-[#196dcc]">
            <Radio aria-hidden="true" size={23} />
          </span>
          <div className="max-w-[570px]">
            <p className="text-lg font-semibold tracking-[-0.02em] text-[#1b304c]">
              Belum ada temuan untuk diperiksa
            </p>
            <p className="mt-2 text-sm leading-6 text-[#617087]">
              Temuan dari pemeriksaan sumber resmi akan muncul di sini untuk ditinjau sebelum
              diterbitkan.
            </p>
          </div>
        </div>
      ) : (
        <div className="space-y-5">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <p className="text-sm text-[#526173]">Temuan yang menunggu tinjauan</p>
            <span className="rounded-full border border-[#d6e5f5] bg-[#eef5fc] px-3 py-1 text-xs font-semibold text-[#196dcc]">
              {candidates.length} temuan
            </span>
          </div>
          {candidates.map((candidate) => (
            <RadarCandidateCard
              key={candidate.id}
              candidate={candidate}
              onReviewed={(candidateId, newsId) => {
                setCandidates((current) => current.filter((entry) => entry.id !== candidateId));
                if (newsId) setEmailNewsId(newsId);
              }}
            />
          ))}
        </div>
      )}
      <RadarProgramCandidates initialCandidates={initialProgramCandidates} />
    </div>
  );
}
