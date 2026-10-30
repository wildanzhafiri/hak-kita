'use client';

import { useMemo, useState } from 'react';
import type { Kategori } from '@hakkita/schema';
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
}: UseProgramFiltersOptions): ProgramFilters {
  const [query, setQuery] = useState(initialQuery);
  const [kategori, setKategori] = useState<Kategori | null>(null);
  const [provinsi, setProvinsi] = useState<string | null>(null);
  const [kabkota, setKabkota] = useState<string | null>(null);

  const index = useMemo(() => buildWilayahIndex(wilayah), [wilayah]);
  const kategoriOptions = useMemo(() => listKategori(programs), [programs]);
  const provinsiOptions = useMemo(() => childrenOfWilayah(wilayah, KODE_NASIONAL), [wilayah]);
  const kabkotaOptions = useMemo(
    () => (provinsi ? childrenOfWilayah(wilayah, provinsi) : []),
    [wilayah, provinsi],
  );

  const results = useMemo(
    () => filterPrograms(programs, { query, kategori, wilayah: kabkota ?? provinsi }, index),
    [programs, query, kategori, kabkota, provinsi, index],
  );

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
