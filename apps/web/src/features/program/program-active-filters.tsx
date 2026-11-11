import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { readActiveFilterChips } from './active-filter-chips';
import { FILTER_CONTENT } from './content';
import type { ProgramFiltersProps } from './types';

export function ProgramActiveFilters({ filters }: ProgramFiltersProps) {
  const chips = readActiveFilterChips(filters);
  if (chips.length === 0) return null;

  return (
    <div
      aria-label={FILTER_CONTENT.activeLabel}
      className="mt-[18px] flex flex-wrap items-center gap-2"
      role="group"
    >
      {chips.map((chip) => (
        <Button
          aria-label={FILTER_CONTENT.removeChip(chip.label)}
          className="h-auto min-h-9 max-w-full gap-2 rounded-md border border-[#dbe5ef] bg-[#f3f8fe] px-3 py-1.5 text-left text-xs font-normal whitespace-normal text-[#25354b] hover:bg-[#e8f1fc]"
          key={chip.id}
          onPress={chip.remove}
          tone="quiet"
        >
          <span className="min-w-0 break-words">{chip.label}</span>
          <X aria-hidden="true" className="shrink-0" size={14} />
        </Button>
      ))}
      <Button className="min-h-9 px-2 text-xs" onPress={filters.clearFilters} tone="quiet">
        {FILTER_CONTENT.clearAll}
      </Button>
    </div>
  );
}
