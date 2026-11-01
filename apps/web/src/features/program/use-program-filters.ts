'use client';

import { useMemo, useState } from 'react';
import type { Kategori } from '@hakkita/schema';
import { SERVICE_PRESENTATION } from './constants';
import {
  KODE_NASIONAL,
  buildWilayahIndex,
  childrenOfWilayah,
  filterPrograms,
  listKategori,
} from '@hakkita/domain';
import type { ProgramFilters, UseProgramFiltersOptions } from './types';

function emptyToNull(value: string): string | null {
  return value === '' ? null : value;
}

export function useProgramFilters({
  programs,
  wilayah,
  initialQuery,
  servicePage = false,
}: UseProgramFiltersOptions): ProgramFilters {
  const [query, setQuery] = useState(initialQuery);
  const [kategori, setKategori] = useState<string | null>(null);
  const [provinsi, setProvinsi] = useState<string | null>(null);
  const [kabkota, setKabkota] = useState<string | null>(null);

  const index = useMemo(() => buildWilayahIndex(wilayah), [wilayah]);
  const kategoriOptions = useMemo(
    () =>
      servicePage
        ? [
            ...new Set(
              programs.map(
                (program) => SERVICE_PRESENTATION[program.id]?.category ?? program.kategori,
              ),
            ),
          ].sort((left, right) => left.localeCompare(right, 'id'))
        : listKategori(programs),
    [programs, servicePage],
  );
  const provinsiOptions = useMemo(() => childrenOfWilayah(wilayah, KODE_NASIONAL), [wilayah]);
  const kabkotaOptions = useMemo(
    () => (provinsi ? childrenOfWilayah(wilayah, provinsi) : []),
    [wilayah, provinsi],
  );

  const results = useMemo(() => {
    const filtered = filterPrograms(
      programs,
      {
        query,
        kategori: servicePage ? null : (kategori as Kategori | null),
        wilayah: kabkota ?? provinsi,
      },
      index,
    );
    return servicePage && kategori
      ? filtered.filter(
          (program) =>
            (SERVICE_PRESENTATION[program.id]?.category ?? program.kategori) === kategori,
        )
      : filtered;
  }, [programs, query, kategori, kabkota, provinsi, index, servicePage]);

  return {
    query,
    kategori,
    provinsi,
    kabkota,
    kategoriOptions,
    provinsiOptions,
    kabkotaOptions,
    results,
    setQuery,
    selectKategori: (value) => setKategori(kategoriOptions.find((k) => k === value) ?? null),
    selectProvinsi: (value) => {
      setProvinsi(emptyToNull(value));
      setKabkota(null);
    },
    selectKabkota: (value) => setKabkota(emptyToNull(value)),
    reset: () => {
      setQuery('');
      setKategori(null);
      setProvinsi(null);
      setKabkota(null);
    },
  };
}
