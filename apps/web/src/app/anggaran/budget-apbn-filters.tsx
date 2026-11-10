'use client';

import { useRouter } from 'next/navigation';
import { BudgetFilterField } from './budget-filter-field';
import type { BudgetApbnFiltersProps } from './types';

export function BudgetApbnFilters({ year }: BudgetApbnFiltersProps) {
  const router = useRouter();

  return (
    <div
      aria-label="Filter data anggaran nasional"
      className="mb-6 grid grid-cols-2 gap-4 max-[640px]:grid-cols-1"
    >
      <BudgetFilterField
        label="Tahun Anggaran"
        onChange={(value) => router.push(`/anggaran?scope=apbn&year=${value}`)}
        options={[
          { value: '2026', label: '2026' },
          { value: '2025', label: '2025' },
        ]}
        value={`${year}`}
      />
      <BudgetFilterField
        isDisabled={year !== 2026}
        label="Periode"
        onChange={(value) => router.push(`/anggaran?scope=apbn&year=${year}&period=${value}`)}
        options={
          year === 2026 ? [{ value: '2026-09', label: 'Realisasi sampai 30 September 2026' }] : []
        }
        placeholder={year === 2026 ? 'Pilih periode' : 'Data periode belum tersedia'}
        value={year === 2026 ? '2026-09' : ''}
      />
    </div>
  );
}
