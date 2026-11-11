'use client';

import { SelectField } from '@/components/ui/select-field';
import { TextInput } from '@/components/ui/text-input';
import { ADMIN_PERIOD_OPTIONS } from './constants';
import { PROGRAM_DETAIL_COPY } from './content';
import { EditorField } from './editor-field';
import type { ProgramEditorFieldGroupProps } from './types';

export function ProgramEditorPeriodFields({ draft, onFieldChange }: ProgramEditorFieldGroupProps) {
  return (
    <fieldset className="m-0 min-w-0 rounded-[10px] border border-[#e1e9f2] p-4 sm:p-5">
      <legend className="px-1.5 text-sm font-semibold text-[#253044]">
        {PROGRAM_DETAIL_COPY.periodHeading}
      </legend>
      <p className="mb-4 mt-0 text-sm text-[#64748b]">{PROGRAM_DETAIL_COPY.periodHint}</p>
      <div className="[display:grid] items-start gap-5 sm:grid-cols-3">
        <SelectField
          isLabelVisible
          label={PROGRAM_DETAIL_COPY.periodTypeLabel}
          onChange={(value) => onFieldChange('periodType', value)}
          options={ADMIN_PERIOD_OPTIONS}
          placeholder="Pilih periode"
          value={draft.periodType}
        />
        {draft.periodType === 'date-range' && (
          <>
            <EditorField isRequired label={PROGRAM_DETAIL_COPY.periodOpenLabel}>
              <TextInput
                onChange={(event) => onFieldChange('periodOpen', event.target.value)}
                required
                type="date"
                value={draft.periodOpen}
              />
            </EditorField>
            <EditorField isRequired label={PROGRAM_DETAIL_COPY.periodCloseLabel}>
              <TextInput
                onChange={(event) => onFieldChange('periodClose', event.target.value)}
                required
                type="date"
                value={draft.periodClose}
              />
            </EditorField>
          </>
        )}
      </div>
    </fieldset>
  );
}
