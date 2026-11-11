'use client';

import { useState } from 'react';
import { SlidersHorizontal } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog } from '@/components/ui/dialog';
import { FILTER_CONTENT } from './content';
import { ProgramMoreFields } from './program-more-fields';
import type { ProgramFiltersProps } from './types';

export function ProgramMoreFilters({ filters }: ProgramFiltersProps) {
  const [isOpen, setIsOpen] = useState(false);
  const activeCount =
    filters.manfaat.length +
    Number(Boolean(filters.jenjang)) +
    Number(Boolean(filters.periodeStatus));

  return (
    <Dialog
      closeLabel={FILTER_CONTENT.moreClose}
      description={FILTER_CONTENT.moreDescription}
      onOpenChange={setIsOpen}
      open={isOpen}
      title={FILTER_CONTENT.moreTitle}
      trigger={
        <Button className="h-11 min-h-0 gap-2.5 px-4 text-sm font-medium" tone="quiet">
          <SlidersHorizontal aria-hidden="true" size={18} />
          {activeCount ? `${FILTER_CONTENT.more} (${activeCount})` : FILTER_CONTENT.more}
        </Button>
      }
    >
      <div className="flex flex-col gap-6">
        <div className="max-h-[min(50dvh,440px)] overflow-y-auto pr-2">
          <ProgramMoreFields filters={filters} />
        </div>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <Button
            isDisabled={activeCount === 0}
            onPress={filters.clearMoreFilters}
            tone="secondary"
          >
            {FILTER_CONTENT.moreClear}
          </Button>
          <Button onPress={() => setIsOpen(false)}>
            {FILTER_CONTENT.moreShow(filters.results.length)}
          </Button>
        </div>
      </div>
    </Dialog>
  );
}
