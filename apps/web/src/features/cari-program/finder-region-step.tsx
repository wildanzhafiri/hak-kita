import { SelectField } from '@/components/ui/select-field';
import { NO_SELECTION } from '@/features/profil/constants';
import { FINDER_COPY as COPY } from './content';
import type { FinderRegionStepProps } from './types';

export function FinderRegionStep({ regions, provinsi, kota, onChange }: FinderRegionStepProps) {
  const cities = (provinsi && regions?.citiesByProvince[provinsi]) || [];

  return (
    <div className="grid grid-cols-2 items-start gap-3.5! max-[767px]:grid-cols-1">
      <SelectField
        isDisabled={!regions}
        isLabelVisible
        label={COPY.provinceLabel}
        onChange={(value) => onChange(value === NO_SELECTION ? null : value, null)}
        options={[
          { value: NO_SELECTION, label: COPY.noSelection },
          ...(regions?.provinces.map((province) => ({
            value: province.kode,
            label: province.nama,
          })) ?? []),
        ]}
        placeholder={regions ? COPY.provincePlaceholder : COPY.regionsLoading}
        value={provinsi}
      />
      <SelectField
        isDisabled={!regions || !provinsi}
        isLabelVisible
        label={COPY.cityLabel}
        onChange={(value) => onChange(provinsi, value === NO_SELECTION ? null : value)}
        options={[
          { value: NO_SELECTION, label: COPY.noSelection },
          ...cities.map((city) => ({ value: city.kode, label: city.nama })),
        ]}
        placeholder={provinsi ? COPY.cityPlaceholder : COPY.cityNeedsProvince}
        value={kota}
      />
    </div>
  );
}
