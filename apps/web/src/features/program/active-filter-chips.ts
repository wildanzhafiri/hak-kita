import { PERIOD_FILTER_OPTIONS } from './constants';
import { FILTER_CONTENT } from './content';
import type { ActiveFilterChip, ProgramFilters } from './types';

export function readActiveFilterChips(filters: ProgramFilters): ActiveFilterChip[] {
  const chips: ActiveFilterChip[] = [];
  if (filters.query) {
    chips.push({
      id: 'query',
      label: FILTER_CONTENT.searchChip(filters.query),
      remove: filters.clearQuery,
    });
  }
  if (filters.kategori) {
    chips.push({
      id: 'kategori',
      label: filters.kategori,
      remove: () => filters.selectKategori(''),
    });
  }
  const province = filters.provinsiOptions.find((wilayah) => wilayah.kode === filters.provinsi);
  const regency = filters.kabkotaOptions.find((wilayah) => wilayah.kode === filters.kabkota);
  if (province) {
    chips.push({
      id: 'wilayah',
      label: regency ? `${regency.nama}, ${province.nama}` : province.nama,
      remove: () => filters.selectProvinsi(''),
    });
  }
  for (const sasaran of filters.sasaran) {
    chips.push({
      id: `sasaran-${sasaran}`,
      label: sasaran,
      remove: () => filters.toggleSasaran(sasaran),
    });
  }
  for (const manfaat of filters.manfaat) {
    chips.push({
      id: `manfaat-${manfaat}`,
      label: manfaat,
      remove: () => filters.toggleManfaat(manfaat),
    });
  }
  if (filters.jenjang) {
    chips.push({
      id: 'jenjang',
      label: filters.jenjang,
      remove: () => filters.selectJenjang(''),
    });
  }
  const period = PERIOD_FILTER_OPTIONS.find((option) => option.value === filters.periodeStatus);
  if (period) {
    chips.push({
      id: 'periode',
      label: period.label,
      remove: () => filters.selectPeriodeStatus(''),
    });
  }
  return chips;
}
