'use client';

import { useState } from 'react';
import { formatDate } from '@hakkita/domain';
import { Button } from '@/components/ui/button';
import { Dialog } from '@/components/ui/dialog';
import { TextAreaInput } from '@/components/ui/text-area';
import { TextInput } from '@/components/ui/text-input';
import { VALIDATION_DETAIL_COPY as COPY } from './content';
import { formatFoundAt } from './format-found-at';
import { buildProgramPreviewRows } from './program-preview-rows';
import type { RadarCandidateCardProps, ValidationSource } from './types';
import { useRadarCandidateReview } from './use-radar-candidate-review';
import { ValidationActions } from './validation-actions';
import { ValidationFullInfo } from './validation-full-info';
import { ValidationPreview } from './validation-preview';
import { ValidationSection } from './validation-section';
import { ValidationSources } from './validation-sources';

function readHost(url: string): string {
  try {
    return new URL(url).hostname;
  } catch {
    return url;
  }
}

export function RadarCandidateCard({
  candidate,
  program = null,
  regionName = '',
  onReviewed,
}: RadarCandidateCardProps) {
  const {
    title,
    setTitle,
    summary,
    setSummary,
    emailText,
    setEmailText,
    publishedOn,
    setPublishedOn,
    extraSources,
    setExtraSources,
    isConfirmed,
    setIsConfirmed,
    isRejectOpen,
    setIsRejectOpen,
    isBusy,
    error,
    approve,
    rejectCandidate,
  } = useRadarCandidateReview({ candidate, onReviewed });
  const [isEditing, setIsEditing] = useState(false);
  const [isPublishOpen, setIsPublishOpen] = useState(false);

  const extraUrls = extraSources
    .split('\n')
    .map((url) => url.trim())
    .filter(Boolean);
  const sources: ValidationSource[] = [
    {
      label: readHost(candidate.source_url),
      url: candidate.source_url,
      quotes: candidate.evidence_quote ? [candidate.evidence_quote] : [],
      foundAt: formatFoundAt(candidate.detected_at),
    },
    ...extraUrls.map((url) => ({ label: readHost(url), url, quotes: [] })),
  ];
  const fields = COPY.newsFields;

  if (isEditing) {
    return (
      <ValidationSection title={COPY.sections.correction}>
        <form
          className="space-y-5"
          onSubmit={(event) => {
            event.preventDefault();
            setIsConfirmed(false);
            setIsEditing(false);
          }}
        >
          <div className="grid gap-5 md:grid-cols-[1fr_190px]">
            <label className="block space-y-2 text-sm font-semibold text-[#1b304c]">
              {fields.title}
              <TextInput
                maxLength={180}
                minLength={8}
                onChange={(event) => setTitle(event.target.value)}
                required
                value={title}
              />
            </label>
            <label className="block space-y-2 text-sm font-semibold text-[#1b304c]">
              {fields.publishedOn}
              <TextInput
                onChange={(event) => setPublishedOn(event.target.value)}
                required
                type="date"
                value={publishedOn}
              />
            </label>
          </div>
          <label className="block space-y-2 text-sm font-semibold text-[#1b304c]">
            {fields.summary}
            <TextAreaInput
              maxLength={600}
              minLength={20}
              onChange={(event) => setSummary(event.target.value)}
              required
              value={summary}
            />
          </label>
          <label className="block space-y-2 text-sm font-semibold text-[#1b304c]">
            {fields.emailText}
            <TextAreaInput
              maxLength={1200}
              minLength={20}
              onChange={(event) => setEmailText(event.target.value)}
              required
              value={emailText}
            />
          </label>
          <label className="block space-y-2 text-sm font-semibold text-[#1b304c]">
            {fields.extraSources}, {fields.extraSourcesHint.toLowerCase()}
            <TextAreaInput
              onChange={(event) => setExtraSources(event.target.value)}
              placeholder="https://instansi.go.id/pengumuman"
              value={extraSources}
            />
          </label>
          <div className="flex justify-end border-t border-[#e1e9f2] pt-5">
            <Button type="submit">{COPY.saveCorrection}</Button>
          </div>
        </form>
      </ValidationSection>
    );
  }

  return (
    <>
      <ValidationSection title={COPY.sections.changeSummary}>
        <ValidationPreview
          rows={[
            { label: fields.title, values: title ? [title] : [] },
            { label: fields.summary, values: summary ? [summary] : [] },
            { label: fields.publishedOn, values: publishedOn ? [formatDate(publishedOn)] : [] },
            { label: fields.emailText, values: emailText ? [emailText] : [] },
            { label: fields.extraSources, values: extraUrls },
          ]}
        />
        {program && (
          <ValidationFullInfo
            rows={(({ primary, detail }) => [...primary, ...detail])(
              buildProgramPreviewRows(program, regionName),
            )}
          />
        )}
      </ValidationSection>
      <ValidationSection title={COPY.sections.sources}>
        <p className="mb-4 rounded-lg border-l-4 border-[#e2a222] bg-[#fff9e9] px-4 py-3 text-sm leading-6 text-[#5b4a1d]">
          {COPY.pageChangeWarning}
        </p>
        <ValidationSources sources={sources} />
      </ValidationSection>
      <ValidationActions
        error={error}
        isBusy={isBusy}
        isConfirmed={isConfirmed}
        onApprove={() => setIsPublishOpen(true)}
        onConfirmChange={setIsConfirmed}
        onEdit={() => setIsEditing(true)}
        onReject={() => setIsRejectOpen(true)}
      />
      <Dialog
        closeLabel={COPY.confirmClose}
        description={COPY.newsPublishDescription}
        onOpenChange={setIsPublishOpen}
        open={isPublishOpen}
        title={COPY.newsPublishTitle}
        trigger={null}
      >
        <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
          <Button onPress={() => setIsPublishOpen(false)} tone="secondary" type="button">
            {COPY.cancel}
          </Button>
          <Button
            isDisabled={isBusy}
            onPress={() => {
              setIsPublishOpen(false);
              approve();
            }}
            type="button"
          >
            {COPY.yesPublish}
          </Button>
        </div>
      </Dialog>
      <Dialog
        closeLabel={COPY.confirmClose}
        description={COPY.newsRejectDescription}
        onOpenChange={setIsRejectOpen}
        open={isRejectOpen}
        title={COPY.newsRejectTitle}
        trigger={null}
      >
        <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
          <Button onPress={() => setIsRejectOpen(false)} tone="secondary">
            {COPY.cancel}
          </Button>
          <Button isDisabled={isBusy} onPress={rejectCandidate} tone="danger">
            {COPY.yesReject}
          </Button>
        </div>
      </Dialog>
    </>
  );
}
