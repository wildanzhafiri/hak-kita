'use client';

import { useState } from 'react';
import Link from 'next/link';
import { CircleCheck } from 'lucide-react';
import type { Program } from '@hakkita/schema';
import { Button } from '@/components/ui/button';
import { Dialog } from '@/components/ui/dialog';
import { ProgramEditor } from '@/features/admin/program-editor';
import { attachEvidenceQuotes } from './attach-evidence-quotes';
import { PROGRAM_CANDIDATE_COPY, VALIDATION_DETAIL_COPY as COPY } from './content';
import { buildProgramPreviewRows } from './program-preview-rows';
import type { RadarProgramReviewProps, ValidationSource } from './types';
import { formatFoundAt } from './format-found-at';
import { ValidationActions } from './validation-actions';
import { ValidationFullInfo } from './validation-full-info';
import { ValidationPreview } from './validation-preview';
import { ValidationSection } from './validation-section';
import { ValidationSources } from './validation-sources';

type ReviewResult = { status: 'approved'; href: string | null } | { status: 'rejected' };

function readHost(url: string): string {
  try {
    return new URL(url).hostname;
  } catch {
    return url;
  }
}

export function RadarProgramReview({ candidate, regionName }: RadarProgramReviewProps) {
  const [program, setProgram] = useState<Program>(() =>
    attachEvidenceQuotes(candidate.record.program, candidate.record.evidence),
  );
  const [isEditing, setIsEditing] = useState(false);
  const [isConfirmed, setIsConfirmed] = useState(false);
  const [isPublishOpen, setIsPublishOpen] = useState(false);
  const [isRejectOpen, setIsRejectOpen] = useState(false);
  const [isBusy, setIsBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const [result, setResult] = useState<ReviewResult | null>(null);

  const previewRows = buildProgramPreviewRows(program, regionName);
  const sourcesByUrl = new Map<string, ValidationSource>();
  for (const evidence of candidate.record.evidence) {
    const existing = sourcesByUrl.get(evidence.url);
    if (existing) existing.quotes.push(evidence.quote);
    else {
      sourcesByUrl.set(evidence.url, {
        label: readHost(evidence.url),
        url: evidence.url,
        quotes: [evidence.quote],
        foundAt: formatFoundAt(candidate.detected_at),
      });
    }
  }
  const sources = [...sourcesByUrl.values()];

  async function saveCorrection(corrected: Program): Promise<string | null> {
    try {
      const response = await fetch('/api/admin/radar/programs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'update', candidateId: candidate.id, program: corrected }),
      });
      const body: { error?: string; program?: Program } = await response.json().catch(() => ({}));
      if (!response.ok || !body.program)
        return body.error ?? PROGRAM_CANDIDATE_COPY.correctionFailed;
      setProgram(body.program);
      setIsConfirmed(false);
      setError(null);
      setNotice(PROGRAM_CANDIDATE_COPY.correctionSaved);
      return null;
    } catch {
      return PROGRAM_CANDIDATE_COPY.correctionFailed;
    }
  }

  async function review(action: 'approve' | 'reject') {
    if (isBusy) return;
    setIsBusy(true);
    setError(null);
    setNotice(null);
    try {
      const response = await fetch('/api/admin/radar/programs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action,
          candidateId: candidate.id,
          ...(action === 'approve' ? { program } : {}),
        }),
      });
      const body: { error?: string; programId?: string | null } = await response
        .json()
        .catch(() => ({}));
      if (!response.ok) {
        setError(body.error ?? 'Tinjauan belum tersimpan. Muat ulang lalu coba lagi.');
        return;
      }
      setResult(
        action === 'approve'
          ? {
              status: 'approved',
              href: body.programId ? `/admin/informasi/${body.programId}` : null,
            }
          : { status: 'rejected' },
      );
    } catch {
      setError('Koneksi terputus. Coba simpan tinjauan lagi.');
    } finally {
      setIsBusy(false);
    }
  }

  if (result) {
    return (
      <div className="space-y-4" role="status">
        <p className="flex flex-wrap items-center gap-x-3 gap-y-1 rounded-xl border border-[#b8e1cc] bg-[#edf8f1] px-4 py-3 text-sm text-[#226b43]">
          <CircleCheck aria-hidden="true" className="shrink-0" size={18} />
          <span>
            {result.status === 'approved'
              ? PROGRAM_CANDIDATE_COPY.approved(program.nama)
              : PROGRAM_CANDIDATE_COPY.rejected(program.nama)}
          </span>
          {result.status === 'approved' && result.href && (
            <Link className="font-semibold underline underline-offset-4" href={result.href}>
              {PROGRAM_CANDIDATE_COPY.openDraft}
            </Link>
          )}
        </p>
        <Link
          className="inline-flex min-h-10 items-center text-sm font-semibold text-[#1769c2] underline-offset-4 hover:underline"
          href="/admin/validasi"
        >
          {COPY.backToList}
        </Link>
      </div>
    );
  }

  if (isEditing) {
    return (
      <ValidationSection title={COPY.sections.correction}>
        <div>
          <ProgramEditor
            hideVerification
            onCancel={() => setIsEditing(false)}
            onSave={saveCorrection}
            program={program}
          />
        </div>
      </ValidationSection>
    );
  }

  return (
    <>
      {notice && (
        <p
          className="flex items-center gap-3 rounded-xl border border-[#b8e1cc] bg-[#edf8f1] px-4 py-3 text-sm text-[#226b43]"
          role="status"
        >
          <CircleCheck aria-hidden="true" className="shrink-0" size={18} />
          {notice}
        </p>
      )}
      <ValidationSection title={COPY.sections.newPreview}>
        <ValidationPreview rows={previewRows.primary} />
        <ValidationFullInfo rows={previewRows.detail} />
      </ValidationSection>
      <ValidationSection title={COPY.sections.sources}>
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
        description={PROGRAM_CANDIDATE_COPY.publishDescription}
        onOpenChange={setIsPublishOpen}
        open={isPublishOpen}
        title={PROGRAM_CANDIDATE_COPY.publishTitle}
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
              void review('approve');
            }}
            type="button"
          >
            {COPY.yesPublish}
          </Button>
        </div>
      </Dialog>
      <Dialog
        closeLabel={COPY.confirmClose}
        description="Kandidat akan keluar dari antrean dan tidak disimpan sebagai informasi HAKKITA."
        onOpenChange={setIsRejectOpen}
        open={isRejectOpen}
        title="Tolak kandidat ini?"
        trigger={null}
      >
        <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
          <Button onPress={() => setIsRejectOpen(false)} tone="secondary" type="button">
            {COPY.cancel}
          </Button>
          <Button
            isDisabled={isBusy}
            onPress={() => {
              setIsRejectOpen(false);
              void review('reject');
            }}
            tone="danger"
            type="button"
          >
            {COPY.yesReject}
          </Button>
        </div>
      </Dialog>
    </>
  );
}
