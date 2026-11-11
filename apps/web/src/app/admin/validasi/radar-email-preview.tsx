'use client';

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import type { RadarEmailPreviewProps, RadarEmailPreviewResult } from './types';

export function RadarEmailPreview({ newsId, onDismiss }: RadarEmailPreviewProps) {
  const [preview, setPreview] = useState<RadarEmailPreviewResult | null>(null);
  const [isConfirmed, setIsConfirmed] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSending, setIsSending] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    let isActive = true;
    fetch(`/api/admin/radar/email?newsId=${encodeURIComponent(newsId)}`)
      .then(async (response) => {
        const result: unknown = await response.json();
        if (!response.ok) throw new Error('Pratinjau email belum dapat dimuat.');
        if (
          result &&
          typeof result === 'object' &&
          'html' in result &&
          typeof result.html === 'string' &&
          'subject' in result &&
          typeof result.subject === 'string' &&
          'text' in result &&
          typeof result.text === 'string' &&
          'eligibleCount' in result &&
          typeof result.eligibleCount === 'number'
        ) {
          const parsedPreview: RadarEmailPreviewResult = {
            html: result.html,
            subject: result.subject,
            text: result.text,
            eligibleCount: result.eligibleCount,
          };
          if (isActive) setPreview(parsedPreview);
        }
      })
      .catch((error: unknown) => {
        if (isActive) setMessage(error instanceof Error ? error.message : 'Koneksi terputus.');
      })
      .finally(() => {
        if (isActive) setIsLoading(false);
      });
    return () => {
      isActive = false;
    };
  }, [newsId]);

  async function sendNow() {
    if (!isConfirmed || isSending) return;
    setIsSending(true);
    setMessage(null);
    try {
      const response = await fetch('/api/admin/radar/email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ newsId }),
      });
      const result: unknown = await response.json();
      if (!response.ok)
        throw new Error('Email belum berhasil dikirim. Periksa riwayat lalu coba lagi.');
      if (
        result &&
        typeof result === 'object' &&
        'sent' in result &&
        typeof result.sent === 'number'
      ) {
        const failed = 'failed' in result && typeof result.failed === 'number' ? result.failed : 0;
        setMessage(`Pengiriman selesai: ${result.sent} email terkirim, ${failed} gagal.`);
        setIsComplete(failed === 0);
      }
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Koneksi terputus. Coba lagi.');
    } finally {
      setIsSending(false);
    }
  }

  return (
    <section
      className="mb-6 rounded-xl border border-[#c8d9eb] bg-white p-4 sm:p-6"
      aria-labelledby="radar-email-preview-title"
    >
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 id="radar-email-preview-title" className="text-lg font-semibold text-[#253044]">
            Pratinjau email
          </h2>
          <p className="mt-1 text-sm leading-5 text-[#64748b]">
            Kabar sudah diterbitkan. Periksa isi email sebelum mengirimkannya ke pengikut yang
            mengaktifkan email.
          </p>
        </div>
        <Button isDisabled={isSending} onPress={onDismiss} tone="secondary" type="button">
          Tutup
        </Button>
      </div>
      {isLoading ? <p className="mt-5 text-sm text-[#64748b]">Memuat pratinjau…</p> : null}
      {preview ? (
        <>
          <div className="mt-4 rounded-lg border border-[#dce4ed] bg-[#f7f9fc] p-3 text-sm text-[#334155]">
            <p className="break-words">
              <span className="font-semibold">Subjek:</span> {preview.subject}
            </p>
            <p className="mt-1">
              <span className="font-semibold">Penerima:</span> hingga {preview.eligibleCount}{' '}
              pengikut dengan notifikasi email aktif
            </p>
          </div>
          <iframe
            className="mt-4 h-[520px] w-full rounded-lg border border-[#dce4ed] bg-white sm:h-[640px]"
            title="Pratinjau tampilan email"
            sandbox=""
            srcDoc={preview.html}
          />
          <details className="mt-3">
            <summary className="cursor-pointer text-sm font-medium text-[#1769c2]">
              Lihat versi teks
            </summary>
            <pre className="mt-2 max-h-64 overflow-auto whitespace-pre-wrap break-words rounded-lg bg-[#f7f9fc] p-3 text-xs leading-5 text-[#334155]">
              {preview.text}
            </pre>
          </details>
          <div className="mt-4 flex flex-col gap-4 border-t border-[#e1e9f2] pt-4 sm:flex-row sm:items-center sm:justify-between">
            <Checkbox isSelected={isConfirmed} isDisabled={isSending} onChange={setIsConfirmed}>
              Saya sudah memeriksa isi dan sumber email ini.
            </Checkbox>
            <Button
              isDisabled={!isConfirmed || isSending || isComplete || preview.eligibleCount === 0}
              onPress={() => void sendNow()}
              type="button"
            >
              {isSending ? 'Mengirim…' : isComplete ? 'Selesai dikirim' : 'Kirim sekarang'}
            </Button>
          </div>
        </>
      ) : null}
      {message && (
        <p className="mt-4 text-sm text-[#526173]" role="status">
          {message}
        </p>
      )}
    </section>
  );
}
