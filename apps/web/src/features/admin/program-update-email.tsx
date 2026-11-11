'use client';

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { TextAreaInput } from '@/components/ui/text-area';
import { PROGRAM_UPDATE_EMAIL_COPY as COPY } from './content';
import { EditorField } from './editor-field';
import { EmailPreviewFrame } from './email-preview-frame';
import type { ProgramUpdateEmailPreview, ProgramUpdateEmailProps } from './types';

function readPreview(value: unknown): ProgramUpdateEmailPreview | null {
  if (!value || typeof value !== 'object') return null;
  const { followers, recipients, changes, subject, html, text, isExample } = value as Record<
    string,
    unknown
  >;
  if (typeof followers !== 'number' || typeof recipients !== 'number') return null;
  if (!Array.isArray(changes)) return null;
  return {
    followers,
    recipients,
    changes: changes.filter((change): change is string => typeof change === 'string'),
    subject: typeof subject === 'string' ? subject : null,
    html: typeof html === 'string' ? html : null,
    text: typeof text === 'string' ? text : null,
    isExample: isExample === true,
  };
}

export function ProgramUpdateEmail({ programId }: ProgramUpdateEmailProps) {
  const endpoint = `/api/admin/programs/${encodeURIComponent(programId)}/email`;
  const [preview, setPreview] = useState<ProgramUpdateEmailPreview | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [note, setNote] = useState('');
  const [previewedNote, setPreviewedNote] = useState('');
  const [isConfirmed, setIsConfirmed] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [isDone, setIsDone] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const isNoteStale = note.trim() !== previewedNote;

  useEffect(() => {
    let isActive = true;
    fetch(endpoint)
      .then(async (response) => {
        const parsed = response.ok ? readPreview(await response.json()) : null;
        if (!parsed) throw new Error(COPY.loadFailure);
        if (isActive) setPreview(parsed);
      })
      .catch((error: unknown) => {
        if (isActive) setMessage(error instanceof Error ? error.message : COPY.loadFailure);
      })
      .finally(() => {
        if (isActive) setIsLoading(false);
      });
    return () => {
      isActive = false;
    };
  }, [endpoint]);

  async function post(action: 'preview' | 'send') {
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action, note: note.trim() || undefined }),
    });
    return { ok: response.ok, body: (await response.json().catch(() => null)) as unknown };
  }

  async function refreshPreview() {
    if (isRefreshing) return;
    setIsRefreshing(true);
    setMessage(null);
    setIsConfirmed(false);
    try {
      const { ok, body } = await post('preview');
      const parsed = ok ? readPreview(body) : null;
      if (!parsed) throw new Error(COPY.loadFailure);
      setPreview(parsed);
      setPreviewedNote(note.trim());
    } catch (error) {
      setMessage(error instanceof Error ? error.message : COPY.loadFailure);
    } finally {
      setIsRefreshing(false);
    }
  }

  async function send() {
    if (!isConfirmed || isSending || isNoteStale) return;
    setIsSending(true);
    setMessage(null);
    try {
      const { body } = await post('send');
      const result = body as { sent?: number; failed?: number } | null;
      if (typeof result?.sent !== 'number') throw new Error(COPY.sendFailure);
      const failed = result.failed ?? 0;
      setMessage(COPY.result(result.sent, failed));
      setIsDone(failed === 0);
    } catch (error) {
      setMessage(error instanceof Error ? error.message : COPY.sendFailure);
    } finally {
      setIsSending(false);
    }
  }

  return (
    <div>
      {isLoading && <p className="text-sm text-[#64748b]">{COPY.loading}</p>}
      {preview && (
        <>
          <div className="rounded-lg border border-[#dce4ed] bg-[#f7f9fc] p-3 text-sm text-[#334155]">
            <p>{COPY.followers(preview.followers)}</p>
            <p className="mt-1">{COPY.recipients(preview.recipients)}</p>
            {preview.changes.length > 0 && (
              <p className="mt-1">
                <span className="font-semibold">{COPY.changesLabel}:</span>{' '}
                {preview.changes.map((change) => COPY.changeLabels[change] ?? change).join(', ')}
              </p>
            )}
            {preview.subject && (
              <p className="mt-1 break-words">
                <span className="font-semibold">{COPY.subjectLabel}:</span> {preview.subject}
              </p>
            )}
          </div>
          {preview.recipients === 0 && (
            <p className="mt-4 text-sm text-[#526173]">{COPY.nothingToSend}</p>
          )}
          <div className="mt-5 flex flex-col gap-3">
            <EditorField hint={COPY.noteHint} label={COPY.noteLabel}>
              <TextAreaInput
                className="min-h-24"
                maxLength={600}
                onChange={(event) => {
                  setNote(event.target.value);
                  setIsConfirmed(false);
                }}
                value={note}
              />
            </EditorField>
            <div>
              <Button
                isDisabled={isRefreshing || !isNoteStale}
                onPress={() => void refreshPreview()}
                tone="secondary"
                type="button"
              >
                {isRefreshing ? COPY.refreshing : COPY.refreshPreview}
              </Button>
            </div>
          </div>
          {preview.isExample && preview.html && (
            <p className="mt-4 text-sm font-medium text-[#334155]">{COPY.exampleNote}</p>
          )}
          <EmailPreviewFrame
            html={preview.html}
            summary={COPY.previewToggle}
            text={preview.text}
            textToggle={COPY.textToggle}
            title={COPY.previewTitle}
          />
          {preview.recipients > 0 && (
            <div className="mt-4 flex flex-col gap-4 border-t border-[#e1e9f2] pt-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex flex-col gap-2">
                <Checkbox
                  isDisabled={isSending || isDone || isNoteStale}
                  isSelected={isConfirmed}
                  onChange={setIsConfirmed}
                >
                  {COPY.confirm(preview.recipients)}
                </Checkbox>
                {isNoteStale && <p className="text-xs text-[#a05a00]">{COPY.noteChanged}</p>}
              </div>
              <Button
                isDisabled={!isConfirmed || isSending || isDone || isNoteStale}
                onPress={() => void send()}
                type="button"
              >
                {isSending ? COPY.sending : COPY.send}
              </Button>
            </div>
          )}
        </>
      )}
      {message && (
        <p className="mt-4 text-sm text-[#334155]" role="status">
          {message}
        </p>
      )}
    </div>
  );
}
