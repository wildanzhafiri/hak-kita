'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Popover } from '@/components/ui/popover';
import { FILTER_CONTENT } from './content';
import { ProgramFilterTrigger } from './program-filter-trigger';
import { ProgramRegionFields } from './program-region-fields';
import type { ProgramFiltersProps } from './types';

export function ProgramRegionFilter({ filters }: ProgramFiltersProps) {
  const [isOpen, setIsOpen] = useState(false);
  const province = filters.provinsiOptions.find((wilayah) => wilayah.kode === filters.provinsi);
  const regency = filters.kabkotaOptions.find((wilayah) => wilayah.kode === filters.kabkota);
  const label = regency?.nama ?? province?.nama ?? FILTER_CONTENT.allRegions;

  return (
    <Popover
      className="flex flex-col gap-4 p-5"
      label={FILTER_CONTENT.regionTitle}
      open={isOpen}
      onOpenChange={setIsOpen}
      trigger={<ProgramFilterTrigger label={label} />}
    >
      <p className="m-0 text-[15px] font-semibold text-[#1b304c]">{FILTER_CONTENT.regionTitle}</p>
      <ProgramRegionFields filters={filters} />
      <div className="flex items-center justify-between gap-4">
        <Button
          className="min-h-10 px-0 text-[13px] hover:bg-transparent hover:underline"
          isDisabled={!filters.provinsi}
          onPress={() => filters.selectProvinsi('')}
          tone="quiet"
        >
          {FILTER_CONTENT.regionClear}
        </Button>
        <Button className="min-h-10 px-5 text-[13px]" onPress={() => setIsOpen(false)}>
          {FILTER_CONTENT.regionDone}
        </Button>
      </div>
    </Popover>
  );
}
