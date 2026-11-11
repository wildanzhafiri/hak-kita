import { SelectField } from '@/components/ui/select-field';
import { SORT_OPTIONS } from './constants';
import { FILTER_CONTENT } from './content';
import type { ProgramFiltersProps } from './types';

export function ProgramResultsToolbar({ filters }: ProgramFiltersProps) {
  return (
    <div className="mb-7 mt-6 flex flex-wrap items-center justify-between gap-3 max-[640px]:mb-5 max-[640px]:mt-5">
      <p
        aria-live="polite"
        className="m-0 text-[17px] font-bold text-[#1b304c] max-[640px]:text-lg"
        role="status"
      >
        {FILTER_CONTENT.resultCount(filters.results.length)}
      </p>
      <div className="flex min-w-0 items-center gap-2.5 text-[13px] text-[#687385] max-[640px]:w-full max-[640px]:justify-between max-[640px]:rounded-[9px] max-[640px]:border max-[640px]:border-[#e1e8f1] max-[640px]:bg-[#f5f8fc] max-[640px]:px-3 max-[640px]:py-2">
        <span className="shrink-0">{FILTER_CONTENT.sort}:</span>
        <SelectField
          className="w-[190px] max-w-[60vw]"
          label={FILTER_CONTENT.sortLabel}
          onChange={filters.selectUrutan}
          options={SORT_OPTIONS}
          placeholder={FILTER_CONTENT.sortPlaceholder}
          value={filters.urutan}
        />
      </div>
    </div>
  );
}
