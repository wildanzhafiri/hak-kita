'use client';

import { useState } from 'react';
import { ExternalLink } from 'lucide-react';
import { ResultPagination } from '@/features/program/result-pagination';
import { SOURCE_PAGE_CONTENT } from './content';
import { SOURCE_PAGE_SIZE } from './constants';
import type { SourceInformationListProps } from './types';

function formatCheckedDate(date: string | null): string {
  if (!date) return SOURCE_PAGE_CONTENT.missingDate;

  return new Intl.DateTimeFormat('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    timeZone: 'UTC',
  }).format(new Date(`${date}T00:00:00Z`));
}

export function SourceInformationList({ entries }: SourceInformationListProps) {
  const [page, setPage] = useState(1);
  const pageCount = Math.ceil(entries.length / SOURCE_PAGE_SIZE);
  const start = (page - 1) * SOURCE_PAGE_SIZE;
  const visibleEntries = entries.slice(start, start + SOURCE_PAGE_SIZE);

  return (
    <section aria-labelledby="source-information-list-title" className="mt-9">
      <div className="mb-2 flex flex-wrap items-baseline justify-between gap-x-6 gap-y-2">
        <h2
          id="source-information-list-title"
          className="text-[clamp(20px,2.2vw,24px)] font-semibold leading-[1.35] tracking-[-.02em] text-[#253044]"
        >
          {SOURCE_PAGE_CONTENT.listTitle}
        </h2>
        <p className="text-sm leading-6 text-[#697a8e]">
          Menampilkan {entries.length === 0 ? 0 : start + 1}–
          {Math.min(start + SOURCE_PAGE_SIZE, entries.length)} dari {entries.length} informasi
        </p>
      </div>
      <div className="divide-y divide-[#e1e9f2]">
        {visibleEntries.map((entry) => (
          <article
            className="flex min-w-0 items-center justify-between gap-8 py-6 max-[700px]:flex-col max-[700px]:items-start max-[700px]:gap-4 max-[700px]:py-5"
            key={entry.id}
          >
            <div className="min-w-0">
              <h3 className="text-lg font-semibold leading-[1.4] tracking-[-.015em] text-[#253044] max-[700px]:text-base">
                {entry.name}
              </h3>
              <p className="mt-2 break-words text-sm leading-[1.65] text-[#617087]">
                {entry.agency}
              </p>
              <p className="mt-1 text-xs leading-5 text-[#85909d]">
                {SOURCE_PAGE_CONTENT.checkedDateLabel} {formatCheckedDate(entry.checkedAt)}
              </p>
            </div>
            <a
              className="inline-flex min-h-11 shrink-0 items-center gap-2 rounded-sm text-sm font-semibold text-[#1769c2] underline-offset-4 hover:underline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#1769c2] max-[700px]:min-h-10"
              href={entry.sourceUrl}
              rel="noreferrer"
              target="_blank"
            >
              {SOURCE_PAGE_CONTENT.sourceLink}
              <ExternalLink aria-hidden="true" size={16} />
            </a>
          </article>
        ))}
      </div>
      <ResultPagination
        ariaLabel={SOURCE_PAGE_CONTENT.listAriaLabel}
        page={page}
        pageCount={pageCount}
        onPageChange={setPage}
      />
    </section>
  );
}
