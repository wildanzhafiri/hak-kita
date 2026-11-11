'use client';

import { JENIS_PROGRAM } from '@hakkita/schema';
import { SelectField } from '@/components/ui/select-field';
import { TextAreaInput } from '@/components/ui/text-area';
import { TextInput } from '@/components/ui/text-input';
import {
  ADMIN_CATEGORY_OPTIONS_BY_KIND,
  ADMIN_COVERAGE_OPTIONS,
  ADMIN_DEFAULT_CATEGORY_BY_KIND,
  ADMIN_GATE_OPTIONS,
  ADMIN_KIND_OPTIONS,
} from './constants';
import { PROGRAM_DETAIL_COPY } from './content';
import { EditorField } from './editor-field';
import type { ProgramEditorIdentityFieldsProps } from './types';

function slugify(value: string) {
  return value
    .normalize('NFKD')
    .toLocaleLowerCase('id')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

export function ProgramEditorIdentityFields({
  draft,
  isIdReadOnly,
  onFieldChange,
}: ProgramEditorIdentityFieldsProps) {
  const copy = PROGRAM_DETAIL_COPY;

  return (
    <div className="[display:grid] items-start gap-5 sm:grid-cols-2">
      {!isIdReadOnly && (
        <>
          <EditorField isRequired label={copy.idLabel}>
            <TextInput
              autoComplete="off"
              onChange={(event) => onFieldChange('id', event.target.value)}
              required
              value={draft.id}
            />
          </EditorField>
          <SelectField
            isLabelVisible
            label={copy.kindLabel}
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
        </>
      )}
      <EditorField isRequired label={copy.nameLabel}>
        <TextInput
          onChange={(event) => {
            onFieldChange('name', event.target.value);
            if (!isIdReadOnly && (!draft.id || draft.id === slugify(draft.name))) {
              onFieldChange('id', slugify(event.target.value));
            }
          }}
          required
          value={draft.name}
        />
      </EditorField>
      <SelectField
        isLabelVisible
        isRequired
        label={copy.categoryLabel}
        onChange={(value) => onFieldChange('category', value)}
        options={ADMIN_CATEGORY_OPTIONS_BY_KIND[draft.kind === 'layanan' ? 'layanan' : 'program']}
        placeholder="Pilih kategori"
        value={draft.category}
      />
      <EditorField className="sm:col-span-2" isRequired label={copy.summaryLabel}>
        <TextAreaInput
          className="min-h-24"
          onChange={(event) => onFieldChange('summary', event.target.value)}
          required
          value={draft.summary}
        />
      </EditorField>
      <EditorField className="sm:col-span-2" label={copy.aboutLabel} hint={copy.aboutHint}>
        <TextAreaInput
          className="min-h-24"
          onChange={(event) => onFieldChange('about', event.target.value)}
          value={draft.about}
        />
      </EditorField>
      <EditorField isRequired label={copy.organizerLabel}>
        <TextInput
          onChange={(event) => onFieldChange('organizer', event.target.value)}
          required
          value={draft.organizer}
        />
      </EditorField>
      <SelectField
        isLabelVisible
        label={copy.coverageLevelLabel}
        onChange={(value) => onFieldChange('coverageLevel', value)}
        options={ADMIN_COVERAGE_OPTIONS}
        placeholder="Pilih cakupan"
        value={draft.coverageLevel}
      />
      <EditorField isRequired label={copy.coverageCodeLabel}>
        <TextInput
          onChange={(event) => onFieldChange('coverageCode', event.target.value)}
          required
          value={draft.coverageCode}
        />
      </EditorField>
      <SelectField
        isLabelVisible
        label={copy.gateLabel}
        onChange={(value) => onFieldChange('gateType', value)}
        options={ADMIN_GATE_OPTIONS}
        placeholder="Pilih dasar akses"
        value={draft.gateType}
      />
      <EditorField
        className="sm:col-span-2"
        isRequired
        label={copy.audienceLabel}
        hint={copy.audienceHint}
      >
        <TextAreaInput
          className="min-h-20"
          onChange={(event) => onFieldChange('audience', event.target.value)}
          required
          value={draft.audience}
        />
      </EditorField>
    </div>
  );
}
