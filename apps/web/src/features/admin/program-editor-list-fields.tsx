'use client';

import { TextAreaInput } from '@/components/ui/text-area';
import { PROGRAM_DETAIL_COPY } from './content';
import { EditorField } from './editor-field';
import type { ProgramEditorFieldGroupProps } from './types';

export function ProgramEditorListFields({ draft, onFieldChange }: ProgramEditorFieldGroupProps) {
  return (
    <div className="flex flex-col gap-5">
      <EditorField
        hint={PROGRAM_DETAIL_COPY.documentsHint}
        label={PROGRAM_DETAIL_COPY.documentsLabel}
      >
        <TextAreaInput
          className="min-h-24"
          onChange={(event) => onFieldChange('documents', event.target.value)}
          value={draft.documents}
        />
      </EditorField>
      <EditorField hint={PROGRAM_DETAIL_COPY.stepsHint} label={PROGRAM_DETAIL_COPY.stepsLabel}>
        <TextAreaInput
          className="min-h-28"
          onChange={(event) => onFieldChange('steps', event.target.value)}
          value={draft.steps}
        />
      </EditorField>
    </div>
  );
}
