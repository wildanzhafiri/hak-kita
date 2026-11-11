import { ProgramCategoryField } from './program-category-field';
import { ProgramMoreFields } from './program-more-fields';
import { ProgramRegionFields } from './program-region-fields';
import { ProgramTargetDetails } from './program-target-details';
import type { ProgramFilterFieldsProps } from './types';

export function ProgramFilterFields({ filters, layout, servicePage }: ProgramFilterFieldsProps) {
  return (
    <div
      className={layout === 'sheet' ? 'grid gap-5 p-5 sm:grid-cols-2' : 'grid grid-cols-1 gap-4'}
    >
      <ProgramCategoryField filters={filters} />
      <ProgramRegionFields filters={filters} />
      {!servicePage && (
        <>
          <ProgramTargetDetails filters={filters} />
          <div className="sm:col-span-2">
            <ProgramMoreFields filters={filters} />
          </div>
        </>
      )}
    </div>
  );
}
