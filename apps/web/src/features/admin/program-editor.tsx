'use client';

import { Button } from '@/components/ui/button';
import { PROGRAM_DETAIL_COPY } from './content';
import { ProgramEditorFields } from './program-editor-fields';
import { ProgramEditorRequirements } from './program-editor-requirements';
import { ProgramEditorSteps } from './program-editor-steps';
import { useProgramEditor } from './use-program-editor';
import type { ProgramEditorProps } from './types';

export function ProgramEditor({ program, onCancel }: ProgramEditorProps) {
  const {
    draft,
    isSaving,
    errorMessage,
    handleFieldChange,
    handleRequirementChange,
    handleAddRequirement,
    handleRemoveRequirement,
    handleStepChange,
    handleAddStep,
    handleRemoveStep,
    handleSourceChange,
    handleAddSource,
    handleRemoveSource,
    handleSubmit,
  } = useProgramEditor(program, onCancel);

  return (
    <form className="flex flex-col gap-7" onSubmit={handleSubmit}>
      <ProgramEditorFields
        draft={draft}
        isIdReadOnly={Boolean(program)}
        onFieldChange={handleFieldChange}
        onAddSource={handleAddSource}
        onRemoveSource={handleRemoveSource}
        onSourceChange={handleSourceChange}
        sources={draft.additionalSources}
      />
      <ProgramEditorSteps
        onAddStep={handleAddStep}
        onRemoveStep={handleRemoveStep}
        onStepChange={handleStepChange}
        steps={draft.steps}
      />
      <ProgramEditorRequirements
        onAddRequirement={handleAddRequirement}
        onRemoveRequirement={handleRemoveRequirement}
        onRequirementChange={handleRequirementChange}
        requirements={draft.requirements}
      />
      {errorMessage && (
        <p
          className="rounded-lg border border-[#f0c7c9] bg-[#fff5f5] p-3 text-sm text-[#a72b32]"
          role="alert"
        >
          {errorMessage}
        </p>
      )}
      <div className="flex flex-wrap justify-end gap-3 border-t border-[#e1e9f2] pt-5">
        {onCancel && (
          <Button isDisabled={isSaving} onPress={onCancel} tone="secondary" type="button">
            {PROGRAM_DETAIL_COPY.cancelEdit}
          </Button>
        )}
        <Button isDisabled={isSaving} type="submit">
          {isSaving
            ? 'Menyimpan'
            : program
              ? PROGRAM_DETAIL_COPY.saveAction
              : PROGRAM_DETAIL_COPY.createSubmit}
        </Button>
      </div>
    </form>
  );
}
