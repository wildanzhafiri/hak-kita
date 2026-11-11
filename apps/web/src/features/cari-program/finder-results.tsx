'use client';

import { useEffect, useState } from 'react';
import { ArrowRight, Info } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ButtonLink } from '@/components/ui/button-link';
import { FINDER_COPY as COPY } from './content';
import { fetchRecommendations } from './finder-data';
import { FinderResultCard } from './finder-result-card';
import { summarizeAnswers } from './finder-state';
import type { FinderResultsProps, FinderResultsState } from './types';

export function FinderResults({ answers, regions, onClose }: FinderResultsProps) {
  const [results, setResults] = useState<FinderResultsState>({ status: 'loading' });
  const summary = summarizeAnswers(answers, regions);

  useEffect(() => {
    let isActive = true;
    fetchRecommendations(answers)
      .then((recommendations) => {
        if (isActive) setResults({ status: 'ready', recommendations });
      })
      .catch(() => {
        if (isActive) setResults({ status: 'error' });
      });
    return () => {
      isActive = false;
    };
  }, [answers]);

  return (
    <section
      aria-labelledby="finder-results-heading"
      className="mx-auto mt-1 w-full max-w-[744px] max-[767px]:mt-6"
    >
      <h2
        className="m-0 pr-10 text-2xl font-semibold leading-[1.35] text-[#253044] max-[767px]:text-[21px]"
        id="finder-results-heading"
      >
        {COPY.resultsTitle}
      </h2>
      <div
        aria-label={COPY.summaryLabel}
        className="mb-6 mt-5 flex flex-wrap gap-2 max-[767px]:mt-4"
        role="group"
      >
        {summary.shown.map((answer, index) => (
          <span
            className="max-w-full overflow-hidden text-ellipsis whitespace-nowrap rounded-full border border-[#dbe8f7] bg-[#f5f8fc] px-2.5 py-1.5 text-xs leading-tight text-[#475569]"
            key={`${answer}-${index}`}
          >
            {answer}
          </span>
        ))}
        {summary.hidden > 0 && (
          <span className="rounded-full border border-[#dbe8f7] bg-[#f5f8fc] px-2.5 py-1.5 text-xs leading-tight text-[#475569]">
            +{summary.hidden} {COPY.summaryMore}
          </span>
        )}
      </div>

      {results.status === 'loading' && (
        <p className="m-0 py-6 text-sm text-[#475569]" role="status">
          {COPY.loadingResults}
        </p>
      )}
      {results.status === 'error' && (
        <p className="m-0 py-2 text-sm text-[#a13239]" role="alert">
          {COPY.resultsError}
        </p>
      )}
      {results.status === 'ready' && results.recommendations.length > 0 && (
        <div className="grid grid-cols-2 items-stretch gap-5 max-[767px]:grid-cols-1">
          {results.recommendations.map((recommendation) => (
            <FinderResultCard key={recommendation.program.id} recommendation={recommendation} />
          ))}
        </div>
      )}
      {results.status === 'ready' && results.recommendations.length === 0 && (
        <div
          className="flex items-start gap-[13px] rounded-xl border border-[#e1e9f2] bg-[#f5f8fc] p-[22px] text-[#1769c2] max-[767px]:p-[18px]"
          role="status"
        >
          <Info aria-hidden="true" className="shrink-0" size={24} />
          <div>
            <h3 className="m-0 text-[17px] font-semibold text-[#253044]">{COPY.emptyTitle}</h3>
            <p className="m-0 mt-1.5 text-sm leading-[1.55] text-[#475569]">
              {COPY.emptyDescription}
            </p>
            <div className="mt-5 flex flex-wrap items-center gap-3 max-[767px]:flex-col max-[767px]:items-stretch">
              <Button onPress={onClose} tone="secondary">
                {COPY.close}
              </Button>
              <ButtonLink href="/kenali-hakmu" icon={<ArrowRight aria-hidden="true" size={17} />}>
                {COPY.browseAll}
              </ButtonLink>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
