import { VALIDATION_DETAIL_COPY } from './content';
import type { ValidationFullInfoProps } from './types';
import { ValidationPreview } from './validation-preview';

export function ValidationFullInfo({ rows }: ValidationFullInfoProps) {
  return (
    <details className="group mt-4 border-t border-[#e1e9f2] pt-4">
      <summary className="cursor-pointer select-none text-[13px] font-semibold text-[#1769c2] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1769c2]">
        {VALIDATION_DETAIL_COPY.fullInfo}
      </summary>
      <div className="mt-2">
        <ValidationPreview rows={rows} />
      </div>
    </details>
  );
}
