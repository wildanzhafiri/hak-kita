'use client';

import { JENIS_PROGRAM } from '@hakkita/schema';
import { SelectField } from '@/components/ui/select-field';
import { TextAreaInput } from '@/components/ui/text-area';
import { TextInput } from '@/components/ui/text-input';
import {
  ADMIN_CATEGORY_OPTIONS_BY_KIND,
  ADMIN_DEFAULT_CATEGORY_BY_KIND,
  ADMIN_KIND_OPTIONS,
} from './constants';
import { PROGRAM_DETAIL_COPY } from './content';
import type { ProgramEditorIdentityFieldsProps } from './types';

export function ProgramEditorIdentityFields({
  draft,
  isIdReadOnly,
  onFieldChange,
}: ProgramEditorIdentityFieldsProps) {
  return (
    <section className="flex flex-col gap-4">
      <div>
        <h2 className="text-base font-semibold text-[#253044]">
          {PROGRAM_DETAIL_COPY.identityHeading}
        </h2>
        <p className="mt-1 text-sm text-[#5f6f83]">Isi nama, instansi, dan ringkasan informasi.</p>
      </div>
      <div className="[display:grid] gap-5 sm:grid-cols-2">
        <label className="flex flex-col gap-2 text-sm font-medium text-[#334155]">
          {PROGRAM_DETAIL_COPY.idLabel}
          <TextInput
            autoComplete="off"
            disabled={isIdReadOnly}
            onChange={(event) => onFieldChange('id', event.target.value)}
            required
            value={draft.id}
          />
        </label>
        <SelectField
          label={PROGRAM_DETAIL_COPY.kindLabel}
          isDisabled={isIdReadOnly}
          onChange={(value) => {
            const kind = JENIS_PROGRAM.find((option) => option === value);
            if (!kind) return;
            onFieldChange('kind', kind);
            const availableCategories = ADMIN_CATEGORY_OPTIONS_BY_KIND[kind];
            if (!availableCategories.some((option) => option.value === draft.category)) {
              onFieldChange('category', ADMIN_DEFAULT_CATEGORY_BY_KIND[kind]);
            }
          }}
          options={ADMIN_KIND_OPTIONS}
          placeholder="Pilih jenis"
          value={draft.kind}
        />
        <label className="flex flex-col gap-2 text-sm font-medium text-[#334155]">
          {PROGRAM_DETAIL_COPY.nameLabel}
          <TextInput
            onChange={(event) => {
              onFieldChange('name', event.target.value);
              if (!draft.id || draft.id === slugify(draft.name)) {
                onFieldChange('id', slugify(event.target.value));
              }
            }}
            required
            value={draft.name}
          />
        </label>
        <SelectField
          label={PROGRAM_DETAIL_COPY.categoryLabel}
          onChange={(value) => onFieldChange('category', value)}
          options={ADMIN_CATEGORY_OPTIONS_BY_KIND[draft.kind === 'layanan' ? 'layanan' : 'program']}
          placeholder="Pilih kategori"
          value={draft.category}
        />
        <label className="flex flex-col gap-2 text-sm font-medium text-[#334155]">
          {PROGRAM_DETAIL_COPY.organizerLabel}
          <TextInput
            onChange={(event) => onFieldChange('organizer', event.target.value)}
            required
            value={draft.organizer}
          />
        </label>
        <label className="flex flex-col gap-2 text-sm font-medium text-[#334155] sm:col-span-2">
          {PROGRAM_DETAIL_COPY.summaryLabel}
          <TextAreaInput
            aria-label={PROGRAM_DETAIL_COPY.summaryLabel}
            className="min-h-24"
            onChange={(event) => onFieldChange('summary', event.target.value)}
            required
            value={draft.summary}
          />
        </label>
        <label className="flex flex-col gap-2 text-sm font-medium text-[#334155] sm:col-span-2">
          {PROGRAM_DETAIL_COPY.audienceLabel}
          <TextAreaInput
            aria-label={PROGRAM_DETAIL_COPY.audienceLabel}
            className="min-h-20"
            onChange={(event) => onFieldChange('audience', event.target.value)}
            required
            value={draft.audience}
          />
          <span className="font-normal text-[#5f6f83]">{PROGRAM_DETAIL_COPY.audienceHint}</span>
        </label>
      </div>
    </section>
  );
}

function slugify(value: string) {
  return value
    .normalize('NFKD')
    .toLocaleLowerCase('id')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}
