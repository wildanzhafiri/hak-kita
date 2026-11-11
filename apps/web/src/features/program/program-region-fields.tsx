import { SelectField } from '@/components/ui/select-field';
import { ALL_OPTION_VALUE } from './constants';
import { FILTER_CONTENT } from './content';
import { ProgramFilterField } from './program-filter-field';
import type { ProgramFiltersProps } from './types';

export function ProgramRegionFields({ filters }: ProgramFiltersProps) {
  const emptyRegencyLabel = filters.provinsi
    ? FILTER_CONTENT.allInProvince
    : FILTER_CONTENT.pickProvinceFirst;

  return (
    <>
      <ProgramFilterField label={FILTER_CONTENT.province}>
        <SelectField
          label={FILTER_CONTENT.province}
          placeholder={FILTER_CONTENT.allRegions}
          value={filters.provinsi ?? ALL_OPTION_VALUE}
          options={[
            { value: ALL_OPTION_VALUE, label: FILTER_CONTENT.allRegions },
            ...filters.provinsiOptions.map((wilayah) => ({
              value: wilayah.kode,
              label: wilayah.nama,
            })),
          ]}
          onChange={(value) => filters.selectProvinsi(value === ALL_OPTION_VALUE ? '' : value)}
        />
      </ProgramFilterField>
      <ProgramFilterField label={FILTER_CONTENT.regency}>
        <SelectField
          label={FILTER_CONTENT.regency}
          placeholder={emptyRegencyLabel}
          value={filters.provinsi ? (filters.kabkota ?? ALL_OPTION_VALUE) : null}
          options={[
            { value: ALL_OPTION_VALUE, label: emptyRegencyLabel },
            ...filters.kabkotaOptions.map((wilayah) => ({
              value: wilayah.kode,
              label: wilayah.nama,
            })),
          ]}
          isDisabled={filters.kabkotaOptions.length === 0}
          onChange={(value) => filters.selectKabkota(value === ALL_OPTION_VALUE ? '' : value)}
        />
      </ProgramFilterField>
    </>
  );
}
