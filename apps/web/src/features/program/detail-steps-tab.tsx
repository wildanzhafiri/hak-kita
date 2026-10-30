import { OfficialSiteLink } from '@/components/program/official-site-link';
import { DEFAULT_STEPS } from './constants';
import type { StepsTabProps } from './types';

export function DetailStepsTab({ program }: StepsTabProps) {
  const steps = program.langkah.length > 0 ? program.langkah : DEFAULT_STEPS;
  return (
    <>
      <h2>Langkah berikutnya</h2>
      <div className="steps">
        {steps.map((step, i) => (
          <div className="step" key={step}>
            <span>{i + 1}</span>
            <p>{step}</p>
          </div>
        ))}
      </div>
      <OfficialSiteLink url={program.sumberUtama.url} className="button" />
    </>
  );
}
