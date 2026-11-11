import { SelectField } from '@/components/ui/select-field';
import { ALL_OPTION_VALUE, PERIOD_FILTER_OPTIONS } from './constants';
import { FILTER_CONTENT } from './content';
import { ProgramFilterField } from './program-filter-field';
import type { ProgramFiltersProps } from './types';

export function ProgramPeriodField({ filters }: ProgramFiltersProps) {
  return (
    <ProgramFilterField label={FILTER_CONTENT.period}>
      <SelectField
        label={FILTER_CONTENT.period}
        placeholder={FILTER_CONTENT.allPeriods}
        value={filters.periodeStatus ?? ALL_OPTION_VALUE}
        options={[
          { value: ALL_OPTION_VALUE, label: FILTER_CONTENT.allPeriods },
          ...PERIOD_FILTER_OPTIONS,
        ]}
        onChange={(value) => filters.selectPeriodeStatus(value === ALL_OPTION_VALUE ? '' : value)}
      />
    </ProgramFilterField>
  );
}
