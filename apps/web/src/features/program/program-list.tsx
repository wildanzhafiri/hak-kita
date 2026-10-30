'use client';

import { HeartHandshake } from 'lucide-react';
import { ProgramGrid } from '@/components/program/program-grid';
import { DataNote } from '@/components/ui/data-note';
import { DEFAULT_SEARCH_PLACEHOLDER } from './constants';
import { ProgramFilterBar } from './program-filter-bar';
import type { ProgramListProps } from './types';
import { useProgramFilters } from './use-program-filters';

export function ProgramList({
  programs,
  wilayah,
  builtOn,
  initialQuery = '',
  placeholder = DEFAULT_SEARCH_PLACEHOLDER,
}: ProgramListProps) {
  const filters = useProgramFilters({ programs, wilayah, initialQuery });

  return (
    <>
      <ProgramFilterBar filters={filters} placeholder={placeholder} />
      <div className="results-top">
        <span aria-live="polite">
          <strong>{filters.results.length}</strong> hasil untuk kamu
        </span>
      </div>
      {filters.results.length > 0 ? (
        <ProgramGrid programs={filters.results} wilayah={wilayah} builtOn={builtOn} />
      ) : (
        <div className="empty">
          <HeartHandshake size={38} />
          <h3>Belum ada hasil yang sesuai.</h3>
          <p>Coba ubah kategori atau wilayah pencarianmu. Daftar ini masih terus bertambah.</p>
          <button className="button secondary" onClick={filters.reset}>
            Atur ulang filter
          </button>
        </div>
      )}
      <DataNote />
    </>
  );
}
