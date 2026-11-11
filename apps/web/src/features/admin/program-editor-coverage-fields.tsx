'use client';

import { SelectField } from '@/components/ui/select-field';
import { TextInput } from '@/components/ui/text-input';
import { ADMIN_COVERAGE_OPTIONS, ADMIN_GATE_OPTIONS } from './constants';
import { PROGRAM_DETAIL_COPY } from './content';
import type { ProgramEditorFieldGroupProps } from './types';

export function ProgramEditorCoverageFields({
  draft,
  onFieldChange,
}: ProgramEditorFieldGroupProps) {
  return (
    <section className="flex flex-col gap-4">
      <div>
        <h2 className="text-base font-semibold text-[#253044]">
          {PROGRAM_DETAIL_COPY.coverageHeading}
        </h2>
        <p className="mt-1 text-sm text-[#5f6f83]">Tentukan cakupan dan dasar akses program.</p>
      </div>
      <div className="[display:grid] gap-5 sm:grid-cols-2">
        <SelectField
          label={PROGRAM_DETAIL_COPY.coverageLevelLabel}
          onChange={(value) => onFieldChange('coverageLevel', value)}
          options={ADMIN_COVERAGE_OPTIONS}
          placeholder="Pilih cakupan"
          value={draft.coverageLevel}
        />
        <label className="flex flex-col gap-2 text-sm font-medium text-[#334155]">
          {PROGRAM_DETAIL_COPY.coverageCodeLabel}
          <TextInput
            onChange={(event) => onFieldChange('coverageCode', event.target.value)}
            required
            value={draft.coverageCode}
          />
        </label>
        <SelectField
          label={PROGRAM_DETAIL_COPY.gateLabel}
          onChange={(value) => onFieldChange('gateType', value)}
          options={ADMIN_GATE_OPTIONS}
          placeholder="Pilih dasar akses"
          value={draft.gateType}
        />
      </div>
    </section>
  );
}
