import { DEFAULT_STEPS } from './constants';
import { DetailSection } from './detail-section';
import type { StepsSectionProps } from './types';

export function DetailStepsSection({ program }: StepsSectionProps) {
  const steps = program.langkah.length > 0 ? program.langkah : DEFAULT_STEPS;
  return (
    <DetailSection id="langkah" title="Langkah pengurusan">
      <ol className="mt-5 flex flex-col gap-[23px]">
        {steps.map((step, i) => (
          <li className="relative flex items-start gap-[18px]" key={step}>
            {i < steps.length - 1 && (
              <span
                aria-hidden="true"
                className="absolute -bottom-6 left-[15px] top-8 w-px bg-[var(--primary)] opacity-40"
              />
            )}
            <span
              aria-hidden="true"
              className="relative z-10 grid size-8 shrink-0 place-items-center rounded-full bg-[var(--mint)] font-bold text-[11px] text-[var(--primary)]"
            >
              {i + 1}
            </span>
            <p className="pt-1 text-sm leading-6 text-[var(--muted)]">{step}</p>
          </li>
        ))}
      </ol>
    </DetailSection>
  );
}
