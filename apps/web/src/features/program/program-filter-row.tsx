import { ProgramCategoryField } from './program-category-field';
import { ProgramMoreFilters } from './program-more-filters';
import { ProgramRegionFilter } from './program-region-filter';
import { ProgramTargetFilter } from './program-target-filter';
import type { ProgramFiltersProps } from './types';

export function ProgramFilterRow({ filters }: ProgramFiltersProps) {
  return (
    <div
      aria-label="Filter program"
      className="mt-[18px] flex flex-wrap items-center gap-3 max-[640px]:hidden"
      role="group"
    >
      <div className="w-[230px] max-w-full">
        <ProgramCategoryField filters={filters} hideLabel />
      </div>
      <ProgramRegionFilter filters={filters} />
      <ProgramTargetFilter filters={filters} />
      <ProgramMoreFilters filters={filters} />
    </div>
  );
}
