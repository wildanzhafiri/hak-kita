import { SelectField } from '@/components/ui/select-field';
import { NO_SELECTION } from './constants';
import { PROFILE_EDITOR_COPY as COPY } from './content';
import type { ProfileRegionFieldsProps } from './types';

export function ProfileRegionFields({
  regions,
  provinsi,
  kota,
  isDisabled,
  onChange,
}: ProfileRegionFieldsProps) {
  const cities = regions.citiesByProvince[provinsi] ?? [];

  return (
    <section className="border-b border-[#e7ecf2] pb-8">
      <h2 className="m-0 mb-2 text-xl font-semibold text-[#253044]">{COPY.regionHeading}</h2>
      <p className="m-0 mb-5 text-sm leading-6 text-[#64748b]">{COPY.regionHint}</p>
      <div className="[display:grid] items-start gap-3 sm:grid-cols-2">
        <SelectField
          isDisabled={isDisabled}
          isLabelVisible
          label={COPY.provinceLabel}
          onChange={(value) => onChange(value === NO_SELECTION ? '' : value, '')}
          options={[
            { value: NO_SELECTION, label: COPY.noSelection },
            ...regions.provinces.map((province) => ({
              value: province.kode,
              label: province.nama,
            })),
          ]}
          placeholder={COPY.provincePlaceholder}
          value={provinsi || null}
        />
        <SelectField
          isDisabled={isDisabled || !provinsi}
          isLabelVisible
          label={COPY.cityLabel}
          onChange={(value) => onChange(provinsi, value === NO_SELECTION ? '' : value)}
          options={[
            { value: NO_SELECTION, label: COPY.noSelection },
            ...cities.map((city) => ({ value: city.kode, label: city.nama })),
          ]}
          placeholder={provinsi ? COPY.cityPlaceholder : COPY.cityNeedsProvince}
          value={kota || null}
        />
      </div>
    </section>
  );
}
