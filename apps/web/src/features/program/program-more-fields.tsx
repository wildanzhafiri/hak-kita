import { ProgramBenefitField } from './program-benefit-field';
import { ProgramLevelField } from './program-level-field';
import { ProgramPeriodField } from './program-period-field';
import type { ProgramFiltersProps } from './types';

export function ProgramMoreFields({ filters }: ProgramFiltersProps) {
  return (
    <div className="flex flex-col gap-6">
      <ProgramBenefitField filters={filters} />
      <ProgramLevelField filters={filters} />
      <ProgramPeriodField filters={filters} />
    </div>
  );
}
