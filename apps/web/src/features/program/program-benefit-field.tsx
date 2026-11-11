import { Checkbox } from '@/components/ui/checkbox';
import { FILTER_CONTENT } from './content';
import type { ProgramFiltersProps } from './types';

export function ProgramBenefitField({ filters }: ProgramFiltersProps) {
  return (
    <fieldset className="m-0 flex min-w-0 flex-col gap-3 border-0 p-0">
      <legend className="mb-3 p-0 text-sm font-semibold text-[#1b304c]">
        {FILTER_CONTENT.benefit}
      </legend>
      {filters.manfaatOptions.map((manfaat) => (
        <Checkbox
          isSelected={filters.manfaat.includes(manfaat)}
          key={manfaat}
          onChange={() => filters.toggleManfaat(manfaat)}
        >
          <span className="font-normal">{manfaat}</span>
        </Checkbox>
      ))}
    </fieldset>
  );
}
