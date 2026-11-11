'use client';

import { useState } from 'react';
import { Files, HeartHandshake } from 'lucide-react';
import { ProgramGrid } from '@/components/program/program-grid';
import { Button } from '@/components/ui/button';
import {
  DEFAULT_SEARCH_PLACEHOLDER,
  SERVICE_CATEGORY_DETAILS,
  RESULT_PAGE_SIZE,
} from './constants';
import { ProgramActiveFilters } from './program-active-filters';
import { ProgramFilterBar } from './program-filter-bar';
import { ProgramResultsToolbar } from './program-results-toolbar';
import { ResultPagination } from './result-pagination';
import { orderServices } from './service-order';
import { ServiceResultCard } from './service-result-card';
import type { ProgramListProps } from './types';
import { useProgramFilters } from './use-program-filters';

export function ProgramList({
  programs,
  wilayah,
  initialQuery = '',
  placeholder = DEFAULT_SEARCH_PLACEHOLDER,
  servicePage = false,
  today,
}: ProgramListProps) {
  const filters = useProgramFilters({ programs, wilayah, initialQuery, servicePage, today });
  const filterKey = JSON.stringify([
    filters.query,
    filters.kategori,
    filters.provinsi,
    filters.kabkota,
    filters.sasaran,
    filters.manfaat,
    filters.jenjang,
    filters.periodeStatus,
    filters.urutan,
  ]);
  const [pagination, setPagination] = useState({ filterKey, page: 1 });
  const page = pagination.filterKey === filterKey ? pagination.page : 1;
  const orderedResults = servicePage ? orderServices(filters.results) : filters.results;
  const pageCount = Math.max(1, Math.ceil(orderedResults.length / RESULT_PAGE_SIZE));
  const visiblePage = Math.min(page, pageCount);
  const visibleResults = orderedResults.slice(
    (visiblePage - 1) * RESULT_PAGE_SIZE,
    visiblePage * RESULT_PAGE_SIZE,
  );
  const firstVisibleResult = filters.results.length ? (visiblePage - 1) * RESULT_PAGE_SIZE + 1 : 0;
  const lastVisibleResult = Math.min(visiblePage * RESULT_PAGE_SIZE, filters.results.length);
  const paginationLabel = servicePage
    ? 'Halaman layanan'
    : programs.some((program) => program.jenis === 'layanan')
      ? 'Halaman hasil pencarian'
      : 'Halaman program';
  const handlePageChange = (nextPage: number) => setPagination({ filterKey, page: nextPage });

  return (
    <>
      <ProgramFilterBar
        filters={filters}
        placeholder={placeholder}
        mode="search"
        servicePage={servicePage}
      />
      {servicePage ? (
        <>
          <section aria-labelledby="service-categories-title" className="mt-9">
            <h2
              className="mb-4 text-lg font-semibold tracking-[-0.025em] text-[#253044]"
              id="service-categories-title"
            >
              Jelajahi berdasarkan kategori
            </h2>
            <div className="grid grid-cols-4 gap-3 max-[1023px]:grid-cols-2 max-[540px]:grid-cols-1">
              {filters.kategoriOptions.map((kategori) => {
                const CategoryIcon =
                  Object.entries(SERVICE_CATEGORY_DETAILS).find(([name]) => name === kategori)?.[1]
                    .icon ?? Files;
                return (
                  <Button
                    aria-pressed={filters.kategori === kategori}
                    className={`!h-auto !min-h-[76px] !w-full !justify-start !gap-3 !rounded-xl !border !px-4 !py-3 !text-left !text-sm !font-medium !text-[#253044] !transition-colors max-[540px]:!min-h-[64px] ${filters.kategori === kategori ? '!border-[#1769c2] !bg-[#eaf3ff]' : '!border-[#e1e9f2] !bg-[#f5f8fc] hover:!border-[#c9dbef] hover:!bg-[#edf5ff]'}`}
                    key={kategori}
                    tone="secondary"
                    onPress={() =>
                      filters.selectKategori(filters.kategori === kategori ? '' : kategori)
                    }
                  >
                    <CategoryIcon
                      aria-hidden="true"
                      className="shrink-0 text-[#1769c2]"
                      size={21}
                      strokeWidth={1.6}
                    />
                    <span className="min-w-0 flex-1 leading-5">{kategori}</span>
                  </Button>
                );
              })}
            </div>
          </section>
          <section aria-live="polite" className="mt-8 border-t border-[#e0e7ef] pt-8">
            <div className="mb-[18px] flex min-w-0 flex-wrap items-center justify-between gap-3">
              <h2 className="min-w-0 text-2xl leading-[1.3] font-bold text-[#1b304c] max-[640px]:text-xl">
                {filters.query
                  ? `Hasil pencarian “${filters.query}”`
                  : filters.kategori
                    ? `Layanan ${filters.kategori}`
                    : 'Semua layanan'}
              </h2>
              <p className="m-0 text-right text-sm leading-6 text-[#657386] max-[540px]:w-full max-[540px]:text-left">
                Menampilkan {firstVisibleResult}–{lastVisibleResult} dari {filters.results.length}{' '}
                layanan
              </p>
            </div>
            {filters.results.length > 0 ? (
              <div className="grid grid-cols-3 items-stretch gap-4 max-[1023px]:grid-cols-2 max-[640px]:grid-cols-1">
                {visibleResults.map((program) => (
                  <ServiceResultCard key={program.id} program={program} />
                ))}
              </div>
            ) : (
              <div className="empty">
                <HeartHandshake size={38} />
                <h3>Layanan tidak ditemukan.</h3>
                <p>Coba kata kunci lain atau hapus pilihan kategori untuk memperluas pencarian.</p>
                <Button tone="secondary" onPress={filters.reset}>
                  Reset pencarian
                </Button>
              </div>
            )}
            <ResultPagination
              ariaLabel={paginationLabel}
              page={visiblePage}
              pageCount={pageCount}
              onPageChange={handlePageChange}
            />
          </section>
        </>
      ) : (
        <>
          <ProgramActiveFilters filters={filters} />
          <ProgramResultsToolbar filters={filters} />
          {filters.results.length > 0 ? (
            <ProgramGrid programs={visibleResults} />
          ) : (
            <div className="empty">
              <HeartHandshake size={38} />
              <h3>Belum ada hasil yang sesuai.</h3>
              <p>Coba ubah kata kunci, kategori, wilayah, atau sasaran penerima.</p>
              <Button tone="secondary" onPress={filters.reset}>
                Atur ulang filter
              </Button>
            </div>
          )}
          <ResultPagination
            ariaLabel={paginationLabel}
            page={visiblePage}
            pageCount={pageCount}
            onPageChange={handlePageChange}
          />
        </>
      )}
    </>
  );
}
