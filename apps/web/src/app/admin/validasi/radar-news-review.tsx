'use client';

import { useState } from 'react';
import { CircleCheck } from 'lucide-react';
import { RadarCandidateCard } from './radar-candidate-card';
import { RadarEmailPreview } from './radar-email-preview';
import { VALIDATION_COPY } from './content';
import type { RadarNewsReviewProps } from './types';

type NewsReviewResult = { status: 'approved'; newsId: string | null } | { status: 'rejected' };

export function RadarNewsReview({ candidate, program, regionName }: RadarNewsReviewProps) {
  const [result, setResult] = useState<NewsReviewResult | null>(null);

  if (!result) {
    return (
      <RadarCandidateCard
        candidate={candidate}
        program={program}
        regionName={regionName}
        onReviewed={(_candidateId, newsId) =>
          setResult(newsId ? { status: 'approved', newsId } : { status: 'rejected' })
        }
      />
    );
  }

  return (
    <div className="space-y-5">
      <p
        className="flex items-center gap-3 rounded-xl border border-[#b8e1cc] bg-[#edf8f1] px-4 py-3 text-sm text-[#226b43]"
        role="status"
      >
        <CircleCheck aria-hidden="true" className="shrink-0" size={18} />
        {result.status === 'approved' ? VALIDATION_COPY.newsApproved : VALIDATION_COPY.newsRejected}
      </p>
      {result.status === 'approved' && result.newsId && (
        <RadarEmailPreview
          newsId={result.newsId}
          onDismiss={() => setResult({ status: 'approved', newsId: null })}
        />
      )}
    </div>
  );
}
