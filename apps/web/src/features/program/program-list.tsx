'use client';

import { ChevronRight, Files, HeartHandshake, ListFilter } from 'lucide-react';
import { KATEGORI_STYLE } from '@/components/program/constants';
import { ProgramGrid } from '@/components/program/program-grid';
import { Button } from '@/components/ui/button';
import { DataNote } from '@/components/ui/data-note';
import {
  DEFAULT_SEARCH_PLACEHOLDER,
  SERVICE_CATEGORY_ICONS,
  SERVICE_QUICK_LINK_ORDER,
} from './constants';
import { ProgramFilterBar } from './program-filter-bar';
import { ServiceQuickLink } from './service-quick-link';
import { ServiceResultCard } from './service-result-card';
import type { ProgramListProps } from './types';
import { useProgramFilters } from './use-program-filters';

export function ProgramList({
  programs,
  wilayah,
  initialQuery = '',
  placeholder = DEFAULT_SEARCH_PLACEHOLDER,
  servicePage = false,
}: ProgramListProps) {
  const filters = useProgramFilters({ programs, wilayah, initialQuery, servicePage });
  const hasActiveFilters =
    Boolean(filters.query) ||
    Boolean(filters.kategori) ||
    Boolean(filters.provinsi) ||
    Boolean(filters.kabkota);
  const serviceQuickLinks = [...filters.results].sort(
    (a, b) =>
      SERVICE_QUICK_LINK_ORDER.indexOf(a.id as (typeof SERVICE_QUICK_LINK_ORDER)[number]) -
      SERVICE_QUICK_LINK_ORDER.indexOf(b.id as (typeof SERVICE_QUICK_LINK_ORDER)[number]),
  );

  return (
    <>
      <ProgramFilterBar filters={filters} placeholder={placeholder} mode="search" />
      {servicePage ? (
        <>
          {!hasActiveFilters && (
            <div className="mt-9 space-y-9">
              <section aria-labelledby="service-start-title">
                <h2
                  className="mb-4 text-2xl font-semibold tracking-[-0.025em] text-[#292b2e] max-[640px]:text-xl"
                  id="service-start-title"
                >
                  Mulai Dari Layanan Ini
                </h2>
                {filters.results.length > 0 ? (
                  <div className="grid grid-cols-3 gap-x-9 gap-y-1 max-[760px]:grid-cols-2 max-[480px]:grid-cols-1">
                    {serviceQuickLinks.slice(0, 6).map((program) => (
                      <ServiceQuickLink key={program.id} program={program} />
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-[#687385]">
                    Belum ada layanan yang cocok dengan pencarianmu.
                  </p>
                )}
              </section>
              <section aria-labelledby="service-categories-title">
                <h2
                  className="mb-4 text-2xl font-semibold tracking-[-0.025em] text-[#292b2e] max-[640px]:text-xl"
                  id="service-categories-title"
                >
                  Jelajahi Berdasarkan Kategori
                </h2>
                <div className="grid grid-cols-3 gap-x-[30px] max-[760px]:grid-cols-2 max-[480px]:grid-cols-1">
                  {filters.kategoriOptions.map((kategori) => {
                    const CategoryIcon = servicePage
                      ? (SERVICE_CATEGORY_ICONS[kategori] ?? Files)
                      : KATEGORI_STYLE[kategori as keyof typeof KATEGORI_STYLE].icon;
                    return (
                      <Button
                        className="group !h-auto !min-h-[70px] !w-full !justify-start !gap-3 !rounded-none !border-b !border-[#e1e7ee] !px-0 !py-4 !text-left !text-xs !font-medium !text-[#2674ca] !transition-colors hover:!bg-transparent hover:!text-[#1458a3]"
                        key={kategori}
                        tone="quiet"
                        onPress={() => filters.selectKategori(kategori)}
                      >
                        <CategoryIcon
                          aria-hidden="true"
                          className="shrink-0 text-[#7b95b7]"
                          size={20}
                          strokeWidth={1.6}
                        />
                        <span className="min-w-0 flex-1">{kategori}</span>
                        <ChevronRight
                          aria-hidden="true"
                          className="shrink-0 text-[#196dcc]"
                          size={16}
                        />
                      </Button>
                    );
                  })}
                </div>
              </section>
            </div>
          )}
          <div className="mt-10 grid items-start gap-[42px] border-t border-[#dce1e6] pt-5 lg:grid-cols-[230px_minmax(0,1fr)] max-[900px]:gap-7 max-[760px]:grid-cols-1">
            <aside>
              <h2 className="mb-6 flex items-center gap-2.5 text-base font-semibold tracking-[-0.01em] text-[#263347]">
                <ListFilter aria-hidden="true" size={19} />
                Filter pencarian
              </h2>
              <ProgramFilterBar
                filters={filters}
                placeholder={placeholder}
                mode="filters"
                stacked
              />
            </aside>
            <section aria-live="polite">
              <div className="mb-[18px] flex min-h-[26px] items-center gap-2 text-[13px] text-[#7a8490]">
                <strong className="font-semibold text-[#4d5967]">
                  {filters.results.length} layanan
                </strong>
              </div>
              {filters.results.length > 0 ? (
                <div className="grid grid-cols-2 gap-5 max-[640px]:grid-cols-1">
                  {filters.results.map((program) => (
                    <ServiceResultCard key={program.id} program={program} />
                  ))}
                </div>
              ) : (
                <div className="empty">
                  <HeartHandshake size={38} />
                  <h3>Layanan belum ditemukan.</h3>
                  <p>Coba gunakan kata kunci lain atau ubah filter yang dipilih.</p>
                  <Button tone="secondary" onPress={filters.reset}>
                    Reset filter
                  </Button>
                </div>
              )}
            </section>
            <div className="lg:col-span-2">
              <DataNote />
            </div>
          </div>
        </>
      ) : (
        <>
          <div className="my-[22px]">
            <ProgramFilterBar filters={filters} placeholder={placeholder} mode="filters" />
          </div>
          <div className="mb-[18px] flex min-h-[26px] items-center gap-2 text-[13px] text-[#7a8490]">
            <strong className="font-semibold text-[#4d5967]">
              {filters.results.length} program ditemukan
            </strong>
          </div>
          {filters.results.length > 0 ? (
            <ProgramGrid columns={2} programs={filters.results} />
          ) : (
            <div className="empty">
              <HeartHandshake size={38} />
              <h3>Belum ada hasil yang sesuai.</h3>
              <p>Coba ubah kategori atau wilayah pencarianmu. Daftar ini masih terus bertambah.</p>
              <Button tone="secondary" onPress={filters.reset}>
                Atur ulang filter
              </Button>
            </div>
          )}
          <DataNote />
        </>
      )}
    </>
  );
}
