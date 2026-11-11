import { ExternalLink } from 'lucide-react';
import { VALIDATION_DETAIL_COPY } from './content';
import type { ValidationSourcesProps } from './types';

export function ValidationSources({ sources }: ValidationSourcesProps) {
  if (sources.length === 0) {
    return (
      <p className="flex items-start gap-2 rounded-lg border border-[#f1cdcd] bg-[#fff5f5] px-3.5 py-3 text-[13px] text-[#a32e2e]">
        {VALIDATION_DETAIL_COPY.noSources}
      </p>
    );
  }

  return (
    <ul className="m-0 list-none p-0">
      {sources.map((source, index) => (
        <li
          className="flex flex-wrap items-start gap-x-6 gap-y-3 border-b border-[#e1e9f2] py-[18px] first:pt-0 last:border-b-0 last:pb-0"
          key={`${source.url}-${index}`}
        >
          <div className="min-w-0 flex-[1_1_240px]">
            <p className="m-0 text-sm font-semibold text-[#253044] [overflow-wrap:anywhere]">
              {source.label}
            </p>
            <p className="m-0 mt-1 text-xs text-[#64748b] [overflow-wrap:anywhere]">{source.url}</p>
            {source.foundAt && (
              <p className="m-0 mt-1 text-[11px] text-[#64748b]">
                {VALIDATION_DETAIL_COPY.foundAt(source.foundAt)}
              </p>
            )}
          </div>
          <a
            className="inline-flex min-h-10 shrink-0 items-center gap-2 rounded-lg border border-[#d6e5f5] bg-white px-3.5 text-[13px] font-semibold text-[#1769c2] hover:bg-[#edf5ff] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1769c2]"
            href={source.url}
            rel="noopener noreferrer"
            target="_blank"
          >
            {VALIDATION_DETAIL_COPY.openSource}
            <ExternalLink aria-hidden="true" size={15} />
          </a>
          {source.quotes.length === 0 ? (
            <p className="m-0 w-full rounded-lg bg-[#f5f8fc] p-3 text-xs leading-5 text-[#475569]">
              {VALIDATION_DETAIL_COPY.noEvidence}
            </p>
          ) : (
            source.quotes.map((quote, quoteIndex) => (
              <p
                className="m-0 w-full rounded-lg bg-[#f5f8fc] p-3 text-xs leading-5 text-[#475569] [overflow-wrap:anywhere]"
                key={`${quoteIndex}-${quote}`}
              >
                {`${VALIDATION_DETAIL_COPY.evidence}: “${quote}”`}
              </p>
            ))
          )}
        </li>
      ))}
    </ul>
  );
}
