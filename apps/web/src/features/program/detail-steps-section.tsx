import { isLayanan, programSteps } from '@hakkita/domain';
import { SERVICE_DETAIL_CONTENT } from './content';
import { DetailSection } from './detail-section';
import type { StepsSectionProps } from './types';

export function DetailStepsSection({ program }: StepsSectionProps) {
  const steps = programSteps(program);

  return (
    <DetailSection
      id="langkah"
      title={isLayanan(program) ? SERVICE_DETAIL_CONTENT.steps : 'Cara Mengakses Program'}
      variant="program"
    >
      <ol className="m-0 flex list-none flex-col p-0">
        {steps.map((step, index) => (
          <li
            className="relative grid grid-cols-[32px_minmax(0,1fr)] items-start gap-4 pb-5 last:pb-0"
            key={step}
          >
            {index < steps.length - 1 && (
              <span
                aria-hidden="true"
                className="absolute bottom-1 left-4 top-9 w-px -translate-x-1/2 bg-[#d8e4f2]"
              />
            )}
            <span
              aria-hidden="true"
              className="grid size-8 place-items-center rounded-full bg-[#edf5ff] text-[13px] font-semibold leading-none text-[#1769c2]"
            >
              {index + 1}
            </span>
            <p className="mb-1.5 mt-0.5 text-[15px] leading-[1.75] text-[#536477] [overflow-wrap:anywhere]">
              {step}
            </p>
          </li>
        ))}
      </ol>
    </DetailSection>
  );
}
