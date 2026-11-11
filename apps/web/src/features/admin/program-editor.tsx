'use client';

import { Button } from '@/components/ui/button';
import { PROGRAM_DETAIL_COPY } from './content';
import { ProgramEditorIdentityFields } from './program-editor-identity-fields';
import { ProgramEditorListFields } from './program-editor-list-fields';
import { ProgramEditorPeriodFields } from './program-editor-period-fields';
import { ProgramEditorRequirements } from './program-editor-requirements';
import { ProgramEditorSourceFields } from './program-editor-source-fields';
import { useProgramEditor } from './use-program-editor';
import type { ProgramEditorProps } from './types';

export function ProgramEditor({
  program,
  onCancel,
  onSave,
  onSaved,
  hideVerification,
}: ProgramEditorProps) {
  const {
    draft,
    isSaving,
    errorMessage,
    handleFieldChange,
    handleRequirementChange,
    handleAddRequirement,
    handleRemoveRequirement,
    handleSourceChange,
    handleAddSource,
    handleRemoveSource,
    handleSubmit,
  } = useProgramEditor(program, onCancel, onSave, onSaved);

  return (
    <form className="flex flex-col gap-6" onSubmit={handleSubmit}>
      <ProgramEditorIdentityFields
        draft={draft}
        isIdReadOnly={Boolean(program)}
        onFieldChange={handleFieldChange}
      />
      <ProgramEditorRequirements
        onAddRequirement={handleAddRequirement}
        onRemoveRequirement={handleRemoveRequirement}
        onRequirementChange={handleRequirementChange}
        requirements={draft.requirements}
      />
      <ProgramEditorListFields draft={draft} onFieldChange={handleFieldChange} />
      <ProgramEditorPeriodFields draft={draft} onFieldChange={handleFieldChange} />
      <ProgramEditorSourceFields
        draft={draft}
        hideVerification={hideVerification}
        onAddSource={handleAddSource}
        onFieldChange={handleFieldChange}
        onRemoveSource={handleRemoveSource}
        onSourceChange={handleSourceChange}
        sources={draft.additionalSources}
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
