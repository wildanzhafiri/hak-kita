import { SelectField } from '@/components/ui/select-field';
import { ALL_OPTION_VALUE } from './constants';
import { FILTER_CONTENT } from './content';
import { ProgramFilterField } from './program-filter-field';
import type { ProgramCategoryFieldProps } from './types';

export function ProgramCategoryField({ filters, hideLabel = false }: ProgramCategoryFieldProps) {
  return (
    <ProgramFilterField hideLabel={hideLabel} label={FILTER_CONTENT.category}>
      <SelectField
        label={FILTER_CONTENT.category}
        placeholder={FILTER_CONTENT.allCategories}
        value={filters.kategori ?? ALL_OPTION_VALUE}
        options={[
          { value: ALL_OPTION_VALUE, label: FILTER_CONTENT.allCategories },
          ...filters.kategoriOptions.map((kategori) => ({ value: kategori, label: kategori })),
        ]}
        onChange={(value) => filters.selectKategori(value === ALL_OPTION_VALUE ? '' : value)}
      />
    </ProgramFilterField>
  );
}
