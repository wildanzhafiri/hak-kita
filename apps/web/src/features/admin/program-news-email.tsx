'use client';

import { useState } from 'react';
import type { FormEvent } from 'react';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { TextAreaInput } from '@/components/ui/text-area';
import { TextInput } from '@/components/ui/text-input';
import { PROGRAM_NEWS_EMAIL_COPY as COPY } from './content';
import { EditorField } from './editor-field';
import { EmailPreviewFrame } from './email-preview-frame';
import type { ProgramNewsDraft, ProgramNewsEmailPreview, ProgramNewsEmailProps } from './types';

function todayInJakarta(): string {
  return new Intl.DateTimeFormat('en-CA', { timeZone: 'Asia/Jakarta' }).format(new Date());
}

function readPreview(value: unknown): ProgramNewsEmailPreview | null {
  if (!value || typeof value !== 'object') return null;
  const { subject, html, text, eligibleCount } = value as Record<string, unknown>;
  if (typeof subject !== 'string' || typeof html !== 'string' || typeof text !== 'string') {
    return null;
  }
  if (typeof eligibleCount !== 'number') return null;
  return { subject, html, text, eligibleCount };
}

function readError(value: unknown): string | null {
  if (!value || typeof value !== 'object' || !('error' in value)) return null;
  return typeof value.error === 'string' ? value.error : null;
}

export function ProgramNewsEmail({ programId }: ProgramNewsEmailProps) {
  const [draft, setDraft] = useState<ProgramNewsDraft>(() => ({
    title: '',
    summary: '',
    sourceUrl: '',
    publishedOn: todayInJakarta(),
  }));
  const [preview, setPreview] = useState<ProgramNewsEmailPreview | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isConfirmed, setIsConfirmed] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [isDone, setIsDone] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  function change(field: keyof ProgramNewsDraft, value: string) {
    setDraft((current) => ({ ...current, [field]: value }));
    setPreview(null);
    setIsConfirmed(false);
    setIsDone(false);
    setMessage(null);
  }

  async function submit(action: 'preview' | 'send') {
    const response = await fetch(`/api/admin/programs/${encodeURIComponent(programId)}/news`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action, ...draft }),
    });
    const body: unknown = await response.json().catch(() => null);
    return { ok: response.ok, body };
  }

  async function handlePreview(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (isLoading) return;
    setIsLoading(true);
    setMessage(null);
    setPreview(null);
    try {
      const { ok, body } = await submit('preview');
      const parsed = ok ? readPreview(body) : null;
      if (!parsed) throw new Error(readError(body) ?? COPY.failure);
      setPreview(parsed);
    } catch (error) {
      setMessage(error instanceof Error ? error.message : COPY.failure);
    } finally {
      setIsLoading(false);
    }
  }

  async function send() {
    if (!isConfirmed || isSending) return;
    setIsSending(true);
    setMessage(null);
    try {
      const { body } = await submit('send');
      const result = body as { sent?: number; failed?: number } | null;
      if (typeof result?.sent !== 'number') throw new Error(readError(body) ?? COPY.failure);
      const failed = result.failed ?? 0;
      setMessage(COPY.result(result.sent, failed));
      setIsDone(failed === 0);
    } catch (error) {
      setMessage(error instanceof Error ? error.message : COPY.failure);
    } finally {
      setIsSending(false);
    }
  }

  return (
    <div className="flex flex-col gap-5">
      <form className="flex flex-col gap-5" onSubmit={(event) => void handlePreview(event)}>
        <EditorField hint={COPY.titleHint} isRequired label={COPY.titleLabel}>
          <TextInput
            maxLength={180}
            onChange={(event) => change('title', event.target.value)}
            required
            value={draft.title}
          />
        </EditorField>
        <EditorField hint={COPY.summaryHint} isRequired label={COPY.summaryLabel}>
          <TextAreaInput
            className="min-h-28"
            maxLength={600}
            onChange={(event) => change('summary', event.target.value)}
            required
            value={draft.summary}
          />
        </EditorField>
        <div className="[display:grid] items-start gap-5 sm:grid-cols-2">
          <EditorField hint={COPY.sourceHint} isRequired label={COPY.sourceLabel}>
            <TextInput
              onChange={(event) => change('sourceUrl', event.target.value)}
              required
              type="url"
              value={draft.sourceUrl}
            />
          </EditorField>
          <EditorField isRequired label={COPY.dateLabel}>
            <TextInput
              onChange={(event) => change('publishedOn', event.target.value)}
              required
              type="date"
              value={draft.publishedOn}
            />
          </EditorField>
        </div>
        <div>
          <Button isDisabled={isLoading} tone="secondary" type="submit">
            {isLoading ? COPY.previewing : COPY.preview}
          </Button>
        </div>
      </form>
      {preview && (
        <div className="border-t border-[#e1e9f2] pt-4">
          <div className="rounded-lg border border-[#dce4ed] bg-[#f7f9fc] p-3 text-sm text-[#334155]">
            <p>
              {preview.eligibleCount > 0 ? COPY.recipients(preview.eligibleCount) : COPY.nobody}
            </p>
            <p className="mt-1 break-words">
              <span className="font-semibold">{COPY.subjectLabel}:</span> {preview.subject}
            </p>
          </div>
          <EmailPreviewFrame
            defaultOpen
            summary={COPY.previewToggle}
            html={preview.html}
            text={preview.text}
            textToggle={COPY.textToggle}
            title={COPY.previewTitle}
          />
          {preview.eligibleCount > 0 && (
            <div className="mt-4 flex flex-col gap-4 border-t border-[#e1e9f2] pt-4 sm:flex-row sm:items-center sm:justify-between">
              <Checkbox
                isDisabled={isSending || isDone}
                isSelected={isConfirmed}
                onChange={setIsConfirmed}
              >
                {COPY.confirm(preview.eligibleCount)}
              </Checkbox>
              <Button
                isDisabled={!isConfirmed || isSending || isDone}
                onPress={() => void send()}
                type="button"
              >
                {isSending ? COPY.sending : COPY.send}
              </Button>
            </div>
          )}
        </div>
      )}
      {message && (
        <p className="text-sm text-[#334155]" role="status">
          {message}
        </p>
      )}
    </div>
  );
}
