'use client';

import { SelectField } from '@/components/ui/select-field';
import { TextInput } from '@/components/ui/text-input';
import { ADMIN_PERIOD_OPTIONS } from './constants';
import { PROGRAM_DETAIL_COPY } from './content';
import type { ProgramEditorFieldGroupProps } from './types';

export function ProgramEditorPeriodFields({ draft, onFieldChange }: ProgramEditorFieldGroupProps) {
  return (
    <section className="flex flex-col gap-4">
      <div>
        <h2 className="text-base font-semibold text-[#253044]">
          {PROGRAM_DETAIL_COPY.periodHeading}
        </h2>
        <p className="mt-1 text-sm text-[#5f6f83]">
          Isi tanggal hanya jika periode diumumkan oleh sumber resmi.
        </p>
      </div>
      <div className="[display:grid] gap-5 sm:grid-cols-2">
        <SelectField
          label={PROGRAM_DETAIL_COPY.periodTypeLabel}
          onChange={(value) => onFieldChange('periodType', value)}
          options={ADMIN_PERIOD_OPTIONS}
          placeholder="Pilih periode"
          value={draft.periodType}
        />
        {draft.periodType === 'date-range' && (
          <>
            <label className="flex flex-col gap-2 text-sm font-medium text-[#334155]">
              {PROGRAM_DETAIL_COPY.periodOpenLabel}
              <TextInput
                onChange={(event) => onFieldChange('periodOpen', event.target.value)}
                required
                type="date"
                value={draft.periodOpen}
              />
            </label>
            <label className="flex flex-col gap-2 text-sm font-medium text-[#334155]">
              {PROGRAM_DETAIL_COPY.periodCloseLabel}
              <TextInput
                onChange={(event) => onFieldChange('periodClose', event.target.value)}
                required
                type="date"
                value={draft.periodClose}
              />
            </label>
          </>
        )}
      </div>
    </section>
  );
}
