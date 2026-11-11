import { ChevronDown } from 'lucide-react';
import { FILTER_CONTENT } from './content';
import type { ProgramFiltersProps } from './types';

export function ProgramTargetDetails({ filters }: ProgramFiltersProps) {
  return (
    <details className="group relative flex min-w-0 flex-col gap-2 text-xs font-medium text-[#536477]">
      <summary className="flex cursor-pointer list-none flex-col gap-2 outline-none [&::-webkit-details-marker]:hidden [&:focus-visible>span:last-child]:border-[#196dcc] [&:focus-visible>span:last-child]:ring-2 [&:focus-visible>span:last-child]:ring-[#196dcc]/15">
        <span>{FILTER_CONTENT.target}</span>
        <span className="flex min-h-11 items-center justify-between gap-2 rounded-lg border border-[#dce1e6] bg-white px-3 text-sm font-normal text-[#25354b] hover:border-[#b9c7d6]">
          <span className="min-w-0 truncate">
            {filters.sasaran.length
              ? `${filters.sasaran.length} dipilih`
              : FILTER_CONTENT.allTargets}
          </span>
          <ChevronDown
            aria-hidden="true"
            className="shrink-0 text-[#687385] transition-transform group-open:rotate-180"
            size={16}
          />
        </span>
      </summary>
      <div className="absolute left-0 top-full z-30 mt-1 max-h-64 w-[min(320px,85vw)] overflow-y-auto rounded-lg border border-[#dce1e6] bg-white p-3 shadow-lg">
        <fieldset className="grid gap-2">
          <legend className="sr-only">{FILTER_CONTENT.targetTitle}</legend>
          {filters.sasaranOptions.map((sasaran) => (
            <label
              className="flex min-w-0 items-start gap-2 text-sm font-normal leading-5 text-[#25354b]"
              key={sasaran}
            >
              <input
                checked={filters.sasaran.includes(sasaran)}
                className="mt-1 size-4 shrink-0 accent-[#196dcc]"
                onChange={() => filters.toggleSasaran(sasaran)}
                type="checkbox"
              />
              <span>{sasaran}</span>
            </label>
          ))}
        </fieldset>
      </div>
    </details>
  );
}
