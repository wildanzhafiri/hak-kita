'use client';

import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Popover } from '@/components/ui/popover';
import { FILTER_CONTENT } from './content';
import { ProgramFilterTrigger } from './program-filter-trigger';
import type { ProgramFiltersProps } from './types';

export function ProgramTargetFilter({ filters }: ProgramFiltersProps) {
  const label = filters.sasaran.length
    ? `${FILTER_CONTENT.target} (${filters.sasaran.length})`
    : FILTER_CONTENT.target;

  return (
    <Popover
      className="flex flex-col gap-3 p-4"
      label={FILTER_CONTENT.targetTitle}
      trigger={<ProgramFilterTrigger label={label} />}
    >
      <p className="m-0 text-[13px] font-semibold text-[#1b304c]">{FILTER_CONTENT.targetTitle}</p>
      <div className="flex flex-col gap-2">
        {filters.sasaranOptions.map((sasaran) => (
          <Checkbox
            isSelected={filters.sasaran.includes(sasaran)}
            key={sasaran}
            onChange={() => filters.toggleSasaran(sasaran)}
          >
            {sasaran}
          </Checkbox>
        ))}
      </div>
      <Button
        className="min-h-9 self-start px-0 text-xs hover:bg-transparent hover:underline"
        isDisabled={filters.sasaran.length === 0}
        onPress={filters.clearSasaran}
        tone="quiet"
      >
        {FILTER_CONTENT.targetClear}
      </Button>
    </Popover>
  );
}
