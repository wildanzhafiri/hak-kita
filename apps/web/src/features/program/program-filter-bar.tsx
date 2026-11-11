import { Search, SlidersHorizontal } from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog } from '@/components/ui/dialog';
import { TextInput } from '@/components/ui/text-input';
import { ProgramFilterFields } from './program-filter-fields';
import { ProgramFilterRow } from './program-filter-row';
import type { ProgramFilterBarProps } from './types';

export function ProgramFilterBar({
  filters,
  placeholder,
  mode = 'filters',
  stacked = false,
  servicePage = false,
}: ProgramFilterBarProps) {
  const [filtersOpen, setFiltersOpen] = useState(false);

  if (mode === 'search') {
    return (
      <div className={servicePage ? 'min-w-0' : 'min-w-0 border-b border-[#e1e7ee] pb-[22px]'}>
        <div className="flex min-w-0 items-center gap-2.5">
          <form
            className="flex min-h-[58px] min-w-0 flex-1 items-center overflow-hidden rounded-[9px] border border-[#b9c1ca] bg-white focus-within:outline-2 focus-within:outline-[#bed9f8] focus-within:outline-offset-2"
            onSubmit={(event) => {
              event.preventDefault();
              filters.submitQuery();
            }}
          >
            <Search className="ml-4 shrink-0 text-[#748397] sm:ml-[22px]" size={20} />
            <TextInput
              className="!min-w-0 !flex-1 !rounded-none !border-0 !bg-transparent !px-3 !py-4 !text-[15px] !text-[#292b2e] !shadow-none !outline-none !ring-0 placeholder:!text-[#77808c] focus:!border-0 focus:!shadow-none focus:!ring-0"
              value={filters.draftQuery}
              onChange={(event) => filters.setDraftQuery(event.target.value)}
              placeholder={placeholder}
              aria-label="Cari"
            />
            <Button
              className="!h-[56px] !min-h-[56px] !min-w-[104px] !shrink-0 !rounded-none !px-4 max-[480px]:!min-w-[48px] max-[480px]:!px-0"
              type="submit"
            >
              <Search aria-hidden="true" className="shrink-0" size={18} />
              <span className="max-[480px]:hidden">Cari</span>
            </Button>
          </form>
          {!servicePage && (
            <div className="not-max-[640px]:hidden">
              <Dialog
                closeLabel="Tutup filter"
                description="Pilih kategori, wilayah, dan kriteria program."
                onOpenChange={setFiltersOpen}
                open={filtersOpen}
                side
                mobileSheet
                title="Filter program"
                trigger={
                  <Button
                    aria-label="Buka filter program"
                    className="relative size-12 shrink-0 p-0"
                    tone="secondary"
                  >
                    <SlidersHorizontal aria-hidden="true" size={20} />
                    {filters.kategori ||
                    filters.provinsi ||
                    filters.kabkota ||
                    filters.sasaran.length ||
                    filters.manfaat.length ||
                    filters.jenjang ||
                    filters.periodeStatus ? (
                      <span
                        aria-hidden="true"
                        className="absolute right-2 top-2 size-1.5 rounded-full bg-[#196dcc]"
                      />
                    ) : null}
                  </Button>
                }
              >
                <div className="min-h-0 flex-1 overflow-y-auto">
                  <ProgramFilterFields filters={filters} layout="sheet" servicePage={false} />
                  <div className="flex flex-wrap gap-2 px-5 pb-5">
                    <Button className="flex-1" onPress={filters.clearFilters} tone="secondary">
                      Reset filter
                    </Button>
                    <Button className="flex-1" onPress={() => setFiltersOpen(false)}>
                      Tampilkan hasil
                    </Button>
                  </div>
                </div>
              </Dialog>
            </div>
          )}
        </div>
        {!servicePage && <ProgramFilterRow filters={filters} />}
      </div>
    );
  }

  return (
    <ProgramFilterFields
      filters={filters}
      layout={stacked ? 'stacked' : 'sheet'}
      servicePage={servicePage}
    />
  );
}
