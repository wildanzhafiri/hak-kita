'use client';

import { Plus, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { TextInput } from '@/components/ui/text-input';
import { PROGRAM_DETAIL_COPY } from './content';
import type { ProgramEditorRequirementsProps } from './types';

export function ProgramEditorRequirements({
  requirements,
  onRequirementChange,
  onAddRequirement,
  onRemoveRequirement,
}: ProgramEditorRequirementsProps) {
  return (
    <section className="flex flex-col gap-4">
      <div>
        <h2 className="text-base font-semibold text-[#253044]">
          {PROGRAM_DETAIL_COPY.requirementsHeading}
        </h2>
        <p className="mt-1 max-w-3xl text-sm leading-6 text-[#5f6f83]">
          {PROGRAM_DETAIL_COPY.requirementHint}
        </p>
      </div>
      {requirements.map((requirement, index) => (
        <div
          className="[display:grid] gap-3 rounded-lg border border-[#e1e9f2] bg-[#f9fbfd] p-4 sm:grid-cols-[minmax(0,1fr)_minmax(0,0.8fr)_auto] sm:items-end"
          key={index}
        >
          <label className="flex flex-col gap-2 text-sm font-medium text-[#334155]">
            {PROGRAM_DETAIL_COPY.requirementLabel}
            <TextInput
              aria-label={`${PROGRAM_DETAIL_COPY.requirementLabel} ${index + 1}`}
              onChange={(event) => onRequirementChange(index, 'text', event.target.value)}
              required
              value={requirement.text}
            />
          </label>
          <label className="flex flex-col gap-2 text-sm font-medium text-[#334155]">
            {PROGRAM_DETAIL_COPY.requirementSourceLabel}
            <TextInput
              aria-label={`${PROGRAM_DETAIL_COPY.requirementSourceLabel} ${index + 1}`}
              placeholder="URL resmi yang menyebut syarat ini"
              onChange={(event) => onRequirementChange(index, 'sourceUrl', event.target.value)}
              type="url"
              value={requirement.sourceUrl}
            />
          </label>
          <Button
            aria-label={`${PROGRAM_DETAIL_COPY.removeRequirement} ${index + 1}`}
            className="w-full sm:w-10"
            isDisabled={requirements.length === 1}
            onPress={() => onRemoveRequirement(index)}
            tone="icon"
            type="button"
          >
            <Trash2 aria-hidden="true" size={17} />
          </Button>
        </div>
      ))}
      <Button
        className="justify-self-start"
        onPress={onAddRequirement}
        tone="secondary"
        type="button"
      >
        <Plus aria-hidden="true" size={17} />
        {PROGRAM_DETAIL_COPY.addRequirement}
      </Button>
    </section>
  );
}
