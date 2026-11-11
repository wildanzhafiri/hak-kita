'use client';

import { useMemo, useState } from 'react';
import { JENJANG, KATEGORI_PROGRAM, MANFAAT, type Kategori } from '@hakkita/schema';
import { SERVICE_CATEGORY_ORDER } from './constants';
import {
  KODE_NASIONAL,
  AUDIENCE_OPTIONS,
  audienceGroups,
  buildWilayahIndex,
  childrenOfWilayah,
  filterPrograms,
  periodStatus,
  todayWIB,
} from '@hakkita/domain';
import type { ProgramFilters, UseProgramFiltersOptions } from './types';

function emptyToNull(value: string): string | null {
  return value === '' ? null : value;
}

export function useProgramFilters({
  programs,
  wilayah,
  initialQuery,
  initialCategory,
  servicePage = false,
  today = todayWIB(),
}: UseProgramFiltersOptions): ProgramFilters {
  const [query, setQuery] = useState(initialQuery);
  const [draftQuery, setDraftQuery] = useState(initialQuery);
  const [kategori, setKategori] = useState<string | null>(
    initialCategory &&
      (servicePage
        ? programs.some((program) => program.kategori === initialCategory)
        : KATEGORI_PROGRAM.some((category) => category === initialCategory))
      ? initialCategory
      : null,
  );
  const [provinsi, setProvinsi] = useState<string | null>(null);
  const [kabkota, setKabkota] = useState<string | null>(null);
  const [sasaran, setSasaran] = useState<string[]>([]);
  const [manfaat, setManfaat] = useState<string[]>([]);
  const [jenjang, setJenjang] = useState<string | null>(null);
  const [periodeStatusFilter, setPeriodeStatusFilter] = useState<string | null>(null);
  const [urutan, setUrutan] = useState('nama');

  const index = useMemo(() => buildWilayahIndex(wilayah), [wilayah]);
  const kategoriOptions = useMemo(
    () =>
      servicePage
        ? [...new Set(programs.map((program) => program.kategori))].sort((left, right) => {
            const leftOrder = SERVICE_CATEGORY_ORDER.indexOf(left);
            const rightOrder = SERVICE_CATEGORY_ORDER.indexOf(right);
            return (
              (leftOrder < 0 ? SERVICE_CATEGORY_ORDER.length : leftOrder) -
                (rightOrder < 0 ? SERVICE_CATEGORY_ORDER.length : rightOrder) ||
              left.localeCompare(right, 'id')
            );
          })
        : [...KATEGORI_PROGRAM].sort((left, right) => left.localeCompare(right, 'id')),
    [programs, servicePage],
  );
  const provinsiOptions = useMemo(() => childrenOfWilayah(wilayah, KODE_NASIONAL), [wilayah]);
  const kabkotaOptions = useMemo(
    () => (provinsi ? childrenOfWilayah(wilayah, provinsi) : []),
    [wilayah, provinsi],
  );
  const sasaranOptions = AUDIENCE_OPTIONS;

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
    const byAudience = sasaran.length
      ? filtered.filter((program) =>
          audienceGroups(program).some((audience) => sasaran.includes(audience)),
        )
      : filtered;
    const byBenefit = manfaat.length
      ? byAudience.filter((program) =>
          manfaat.some((item) => program.manfaat?.some((own) => own === item)),
        )
      : byAudience;
    const byLevel = jenjang
      ? byBenefit.filter((program) => program.jenjang?.some((own) => own === jenjang))
      : byBenefit;
    const byPeriod = periodeStatusFilter
      ? byLevel.filter((program) => periodStatus(program.periode, today) === periodeStatusFilter)
      : byLevel;
    const sorted = [...byPeriod].sort((left, right) => {
      if (urutan === 'terbaru') {
        return (
          (right.tanggalDiperiksa ?? '').localeCompare(left.tanggalDiperiksa ?? '') ||
          left.nama.localeCompare(right.nama, 'id')
        );
      }
      if (urutan === 'tenggat') {
        const leftDeadline = typeof left.periode === 'object' ? left.periode.tutup : '9999-12-31';
        const rightDeadline =
          typeof right.periode === 'object' ? right.periode.tutup : '9999-12-31';
        return (
          leftDeadline.localeCompare(rightDeadline) || left.nama.localeCompare(right.nama, 'id')
        );
      }
      return left.nama.localeCompare(right.nama, 'id');
    });
    return servicePage && kategori
      ? sorted.filter((program) => program.kategori === kategori)
      : sorted;
  }, [
    programs,
    query,
    kategori,
    kabkota,
    provinsi,
    index,
    servicePage,
    sasaran,
    manfaat,
    jenjang,
    periodeStatusFilter,
    today,
    urutan,
  ]);

  function clearQuery() {
    setQuery('');
    setDraftQuery('');
  }

  function clearFilters() {
    clearQuery();
    setKategori(null);
    setProvinsi(null);
    setKabkota(null);
    setSasaran([]);
    clearMoreFilters();
  }

  function clearMoreFilters() {
    setManfaat([]);
    setJenjang(null);
    setPeriodeStatusFilter(null);
  }

  return {
    query,
    draftQuery,
    kategori,
    provinsi,
    kabkota,
    sasaran,
    manfaat,
    jenjang,
    periodeStatus: periodeStatusFilter,
    urutan,
    kategoriOptions,
    provinsiOptions,
    kabkotaOptions,
    sasaranOptions,
    manfaatOptions: MANFAAT,
    jenjangOptions: JENJANG,
    results,
    setDraftQuery,
    submitQuery: () => setQuery(draftQuery.trim()),
    selectKategori: (value) => setKategori(kategoriOptions.find((k) => k === value) ?? null),
    selectProvinsi: (value) => {
      setProvinsi(emptyToNull(value));
      setKabkota(null);
    },
    selectKabkota: (value) => setKabkota(emptyToNull(value)),
    toggleSasaran: (value) =>
      setSasaran((current) =>
        current.includes(value) ? current.filter((item) => item !== value) : [...current, value],
      ),
    toggleManfaat: (value) =>
      setManfaat((current) =>
        current.includes(value) ? current.filter((item) => item !== value) : [...current, value],
      ),
    selectJenjang: (value) => setJenjang(emptyToNull(value)),
    clearMoreFilters,
    selectPeriodeStatus: (value) => setPeriodeStatusFilter(emptyToNull(value)),
    selectUrutan: (value) => setUrutan(value),
    clearSasaran: () => setSasaran([]),
    clearQuery,
    clearFilters,
    reset: () => {
      clearFilters();
      setUrutan('nama');
    },
  };
}
