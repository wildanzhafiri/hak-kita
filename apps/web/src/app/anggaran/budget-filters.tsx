'use client';

import { useRouter } from 'next/navigation';
import { BudgetFilterField } from './budget-filter-field';
import type { BudgetFiltersProps } from './types';

export function BudgetFilters({
  filters,
  selectedYear,
  selectedProvince,
  selectedRegion,
}: BudgetFiltersProps) {
  const router = useRouter();
  const provinceOptions = filters.provinces;
  const regionOptions =
    selectedProvince === '--'
      ? [{ value: '--', label: 'Semua wilayah' }]
      : [{ value: '--', label: 'Gabungan kabupaten dan kota' }, ...filters.regions.filter((option) => option.value !== '--')];

  function navigate(year: number, province: string, region?: string) {
    const params = new URLSearchParams({ scope: 'apbd', year: `${year}` });
    if (province !== '--') params.set('province', province);
    if (region) params.set('region', region);
    router.push(`/anggaran?${params.toString()}`);
  }

  return (
    <div
      aria-label="Filter data anggaran daerah"
      className="mb-6 grid grid-cols-3 gap-4 max-[900px]:grid-cols-2 max-[650px]:grid-cols-1"
    >
      <BudgetFilterField
        label="Tahun Anggaran"
        onChange={(value) => navigate(Number(value), selectedProvince, selectedRegion)}
        options={filters.years}
        value={`${selectedYear}`}
      />
      <BudgetFilterField
        label="Provinsi"
        onChange={(value) => navigate(selectedYear, value)}
        options={provinceOptions}
        value={selectedProvince}
      />
      <BudgetFilterField
        label="Wilayah"
        isDisabled={selectedProvince === '--'}
        onChange={(value) => navigate(selectedYear, selectedProvince, value)}
        options={regionOptions}
        value={selectedRegion}
      />
    </div>
  );
}
