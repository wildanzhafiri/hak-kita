'use client';

import { ProgramEditorCoverageFields } from './program-editor-coverage-fields';
import { ProgramEditorIdentityFields } from './program-editor-identity-fields';
import { ProgramEditorPeriodFields } from './program-editor-period-fields';
import { ProgramEditorSourceFields } from './program-editor-source-fields';
import type { ProgramEditorFieldsProps } from './types';

export function ProgramEditorFields({
  draft,
  isIdReadOnly,
  onFieldChange,
  sources,
  onSourceChange,
  onAddSource,
  onRemoveSource,
}: ProgramEditorFieldsProps) {
  return (
    <div className="flex flex-col gap-8">
      <ProgramEditorIdentityFields
        draft={draft}
        isIdReadOnly={isIdReadOnly}
        onFieldChange={onFieldChange}
      />
      <ProgramEditorCoverageFields draft={draft} onFieldChange={onFieldChange} />
      <ProgramEditorPeriodFields draft={draft} onFieldChange={onFieldChange} />
      <ProgramEditorSourceFields
        draft={draft}
        onAddSource={onAddSource}
        onFieldChange={onFieldChange}
        onRemoveSource={onRemoveSource}
        onSourceChange={onSourceChange}
        sources={sources}
      />
    </div>
  );
}
