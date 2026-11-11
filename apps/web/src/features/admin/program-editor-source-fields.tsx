'use client';

import { SelectField } from '@/components/ui/select-field';
import { Button } from '@/components/ui/button';
import { TextAreaInput } from '@/components/ui/text-area';
import { TextInput } from '@/components/ui/text-input';
import {
  ADMIN_MAX_ADDITIONAL_SOURCES,
  ADMIN_SOURCE_TYPE_OPTIONS,
  ADMIN_VERIFICATION_OPTIONS,
} from './constants';
import { PROGRAM_DETAIL_COPY } from './content';
import type { ProgramEditorSourcesProps, ProgramEditorFieldGroupProps } from './types';

export function ProgramEditorSourceFields({
  draft,
  onFieldChange,
  sources,
  onSourceChange,
  onAddSource,
  onRemoveSource,
}: ProgramEditorFieldGroupProps & ProgramEditorSourcesProps) {
  return (
    <section className="flex flex-col gap-4">
      <div>
        <h2 className="text-base font-semibold text-[#253044]">
          {PROGRAM_DETAIL_COPY.sourceHeading}
        </h2>
        <p className="mt-1 text-sm text-[#5f6f83]">
          Masukkan sumber resmi utama yang mendukung informasi program.
        </p>
      </div>
      <div className="flex flex-col gap-3">
        <h3 className="text-sm font-semibold text-[#334155]">
          {PROGRAM_DETAIL_COPY.additionalSourcesLabel}
        </h3>
        <p className="text-sm text-[#5f6f83]">
          Tambahkan halaman resmi lain yang mendukung informasi program. Setiap tautan persyaratan
          tetap dicatat di bagian persyaratan.
        </p>
        {sources.map((source, index) => (
          <div
            className="[display:grid] items-end gap-3 sm:grid-cols-[minmax(0,1fr)_220px_auto]"
            key={index}
          >
            <label className="flex flex-col gap-2 text-sm font-medium text-[#334155]">
              {`Tautan sumber ${index + 2}`}
              <TextInput
                onChange={(event) => onSourceChange(index, 'url', event.target.value)}
                type="url"
                value={source.url}
              />
            </label>
            <SelectField
              label={PROGRAM_DETAIL_COPY.sourceTypeLabel}
              onChange={(value) => onSourceChange(index, 'type', value)}
              options={ADMIN_SOURCE_TYPE_OPTIONS}
              placeholder="Pilih jenis sumber"
              value={source.type}
            />
            <Button
              aria-label={`${PROGRAM_DETAIL_COPY.removeSource} ${index + 2}`}
              onPress={() => onRemoveSource(index)}
              tone="secondary"
              type="button"
            >
              Hapus
            </Button>
          </div>
        ))}
        <div>
          <Button
            isDisabled={sources.length >= ADMIN_MAX_ADDITIONAL_SOURCES}
            onPress={onAddSource}
            tone="secondary"
            type="button"
          >
            {PROGRAM_DETAIL_COPY.addSource}
          </Button>
        </div>
      </div>
      <div className="[display:grid] gap-5 sm:grid-cols-2">
        <SelectField
          label={PROGRAM_DETAIL_COPY.sourceTypeLabel}
          onChange={(value) => onFieldChange('sourceType', value)}
          options={ADMIN_SOURCE_TYPE_OPTIONS}
          placeholder="Pilih jenis sumber"
          value={draft.sourceType}
        />
        <label className="flex flex-col gap-2 text-sm font-medium text-[#334155]">
          {PROGRAM_DETAIL_COPY.sourceUrlLabel}
          <TextInput
            onChange={(event) => onFieldChange('sourceUrl', event.target.value)}
            required
            type="url"
            value={draft.sourceUrl}
          />
        </label>
      </div>
      <div className="[display:grid] gap-5 sm:grid-cols-2">
        <SelectField
          label={PROGRAM_DETAIL_COPY.verificationLabel}
          onChange={(value) => onFieldChange('verification', value)}
          options={ADMIN_VERIFICATION_OPTIONS}
          placeholder="Pilih status pemeriksaan"
          value={draft.verification}
        />
        {draft.verification !== 'belum' && (
          <label className="flex flex-col gap-2 text-sm font-medium text-[#334155]">
            {PROGRAM_DETAIL_COPY.checkedAtLabel}
            <TextInput
              onChange={(event) => onFieldChange('checkedAt', event.target.value)}
              required
              type="date"
              value={draft.checkedAt}
            />
          </label>
        )}
      </div>
      <label className="flex flex-col gap-2 text-sm font-medium text-[#334155]">
        {PROGRAM_DETAIL_COPY.documentsLabel}
        <TextAreaInput
          aria-label={PROGRAM_DETAIL_COPY.documentsLabel}
          className="min-h-24"
          onChange={(event) => onFieldChange('documents', event.target.value)}
          value={draft.documents}
        />
        <span className="font-normal text-[#5f6f83]">{PROGRAM_DETAIL_COPY.documentsHint}</span>
      </label>
    </section>
  );
}
