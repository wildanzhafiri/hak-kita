'use client';

import { Button } from '@/components/ui/button';
import { SelectField } from '@/components/ui/select-field';
import { TextAreaInput } from '@/components/ui/text-area';
import { TextInput } from '@/components/ui/text-input';
import {
  ADMIN_MAX_ADDITIONAL_SOURCES,
  ADMIN_SOURCE_TYPE_OPTIONS,
  ADMIN_VERIFICATION_OPTIONS,
} from './constants';
import { PROGRAM_DETAIL_COPY } from './content';
import { EditorField } from './editor-field';
import type { ProgramEditorSourceFieldsProps } from './types';

export function ProgramEditorSourceFields({
  draft,
  hideVerification = false,
  onFieldChange,
  sources,
  onSourceChange,
  onAddSource,
  onRemoveSource,
}: ProgramEditorSourceFieldsProps) {
  const copy = PROGRAM_DETAIL_COPY;

  return (
    <>
      <div className="[display:grid] items-start gap-5 sm:grid-cols-2">
        <EditorField hint={copy.costHint} label={copy.costLabel}>
          <TextInput
            onChange={(event) => onFieldChange('cost', event.target.value)}
            value={draft.cost}
          />
        </EditorField>
        <EditorField isRequired label={copy.sourceUrlLabel}>
          <TextInput
            onChange={(event) => onFieldChange('sourceUrl', event.target.value)}
            required
            type="url"
            value={draft.sourceUrl}
          />
        </EditorField>
      </div>
      <fieldset className="m-0 min-w-0 rounded-[10px] border border-[#e1e9f2] p-4 sm:p-5">
        <legend className="px-1.5 text-sm font-semibold text-[#253044]">
          {copy.sourceHeading}
        </legend>
        <div className="flex flex-col gap-5">
          <div className="[display:grid] items-start gap-5 sm:grid-cols-2">
            <SelectField
              isLabelVisible
              label={copy.sourceTypeLabel}
              onChange={(value) => onFieldChange('sourceType', value)}
              options={ADMIN_SOURCE_TYPE_OPTIONS}
              placeholder="Pilih jenis sumber"
              value={draft.sourceType}
            />
            {!hideVerification && (
              <SelectField
                isLabelVisible
                label={copy.verificationLabel}
                onChange={(value) => onFieldChange('verification', value)}
                options={ADMIN_VERIFICATION_OPTIONS}
                placeholder="Pilih status pemeriksaan"
                value={draft.verification}
              />
            )}
            {!hideVerification && draft.verification !== 'belum' && (
              <EditorField isRequired label={copy.checkedAtLabel}>
                <TextInput
                  onChange={(event) => onFieldChange('checkedAt', event.target.value)}
                  required
                  type="date"
                  value={draft.checkedAt}
                />
              </EditorField>
            )}
          </div>
          <EditorField label={copy.mainSourceQuoteLabel}>
            <TextAreaInput
              className="min-h-20"
              onChange={(event) => onFieldChange('sourceQuote', event.target.value)}
              value={draft.sourceQuote}
            />
          </EditorField>
          <div className="flex flex-col gap-4 border-t border-[#edf1f6] pt-5">
            <div>
              <h3 className="m-0 text-sm font-semibold text-[#334155]">
                {copy.additionalSourcesLabel}
              </h3>
              <p className="mt-1 text-sm text-[#64748b]">{copy.additionalSourcesHint}</p>
            </div>
            {sources.map((source, index) => (
              <div
                className="flex flex-col gap-4 rounded-[10px] border border-[#e1e9f2] bg-[#f9fbfd] p-4"
                key={index}
              >
                <div className="[display:grid] items-end gap-4 sm:grid-cols-[minmax(0,1fr)_220px_auto]">
                  <EditorField label={`Tautan sumber ${index + 2}`}>
                    <TextInput
                      onChange={(event) => onSourceChange(index, 'url', event.target.value)}
                      type="url"
                      value={source.url}
                    />
                  </EditorField>
                  <SelectField
                    isLabelVisible
                    label={copy.sourceTypeLabel}
                    onChange={(value) => onSourceChange(index, 'type', value)}
                    options={ADMIN_SOURCE_TYPE_OPTIONS}
                    placeholder="Pilih jenis sumber"
                    value={source.type}
                  />
                  <Button
                    aria-label={`${copy.removeSource} ${index + 2}`}
                    onPress={() => onRemoveSource(index)}
                    tone="danger-outline"
                    type="button"
                  >
                    Hapus
                  </Button>
                </div>
                <EditorField label={`${copy.quoteLabel} sumber ${index + 2}`}>
                  <TextAreaInput
                    className="min-h-20"
                    onChange={(event) => onSourceChange(index, 'quote', event.target.value)}
                    value={source.quote}
                  />
                </EditorField>
              </div>
            ))}
            <div>
              <Button
                isDisabled={sources.length >= ADMIN_MAX_ADDITIONAL_SOURCES}
                onPress={onAddSource}
                tone="secondary"
                type="button"
              >
                {copy.addSource}
              </Button>
            </div>
          </div>
        </div>
      </fieldset>
    </>
  );
}
