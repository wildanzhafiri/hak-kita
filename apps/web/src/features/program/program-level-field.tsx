import { SelectField } from '@/components/ui/select-field';
import { ALL_OPTION_VALUE } from './constants';
import { FILTER_CONTENT } from './content';
import { ProgramFilterField } from './program-filter-field';
import type { ProgramFiltersProps } from './types';

export function ProgramLevelField({ filters }: ProgramFiltersProps) {
  return (
    <div>
      <ProgramFilterField label={FILTER_CONTENT.level}>
        <SelectField
          label={FILTER_CONTENT.level}
          placeholder={FILTER_CONTENT.allLevels}
          value={filters.jenjang ?? ALL_OPTION_VALUE}
          options={[
            { value: ALL_OPTION_VALUE, label: FILTER_CONTENT.allLevels },
            ...filters.jenjangOptions.map((jenjang) => ({ value: jenjang, label: jenjang })),
          ]}
          onChange={(value) => filters.selectJenjang(value === ALL_OPTION_VALUE ? '' : value)}
        />
      </ProgramFilterField>
      <p className="mb-0 mt-2 text-xs leading-5 text-[#68788d]">{FILTER_CONTENT.levelHelp}</p>
    </div>
  );
}
