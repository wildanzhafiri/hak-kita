'use client';

import { Plus, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { TextInput } from '@/components/ui/text-input';
import { PROGRAM_DETAIL_COPY } from './content';
import type { ProgramEditorStepsProps } from './types';

export function ProgramEditorSteps({
  steps,
  onStepChange,
  onAddStep,
  onRemoveStep,
}: ProgramEditorStepsProps) {
  return (
    <section className="flex flex-col gap-4">
      <div>
        <h2 className="text-base font-semibold text-[#253044]">{PROGRAM_DETAIL_COPY.stepsLabel}</h2>
        <p className="mt-1 text-sm text-[#5f6f83]">{PROGRAM_DETAIL_COPY.stepsHint}</p>
      </div>
      {steps.map((step, index) => (
        <div
          className="[display:grid] gap-3 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-end"
          key={index}
        >
          <label className="flex flex-col gap-2 text-sm font-medium text-[#334155]">
            {PROGRAM_DETAIL_COPY.stepLabel} {index + 1}
            <TextInput
              aria-label={`${PROGRAM_DETAIL_COPY.stepLabel} ${index + 1}`}
              onChange={(event) => onStepChange(index, event.target.value)}
              required
              value={step}
            />
          </label>
          <Button
            aria-label={`${PROGRAM_DETAIL_COPY.removeStep} ${index + 1}`}
            className="w-full sm:w-10"
            onPress={() => onRemoveStep(index)}
            tone="icon"
            type="button"
          >
            <Trash2 aria-hidden="true" size={17} />
          </Button>
        </div>
      ))}
      <Button className="justify-self-start" onPress={onAddStep} tone="secondary" type="button">
        <Plus aria-hidden="true" size={17} />
        {PROGRAM_DETAIL_COPY.addStep}
      </Button>
    </section>
  );
}
