import { ExternalLink } from 'lucide-react';
import type { RadarCandidateContextProps } from './types';

export function RadarCandidateContext({ candidate }: RadarCandidateContextProps) {
  return (
    <>
      <div className="grid gap-3 border-b border-[#e1e7ee] bg-[#f8fafc] px-5 py-4 sm:grid-cols-[1fr_auto] sm:items-start sm:px-6">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.08em] text-[#526d8c]">
            {candidate.program_name}
          </p>
          <p className="mt-1 text-sm text-[#617087]">
            Terdeteksi{' '}
            {new Intl.DateTimeFormat('id-ID', {
              day: 'numeric',
              month: 'long',
              year: 'numeric',
              timeZone: 'Asia/Jakarta',
            }).format(new Date(candidate.detected_at))}
          </p>
        </div>
        <a
          href={candidate.source_url}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex max-w-full items-center gap-2 break-all text-sm font-semibold text-[#196dcc] underline-offset-4 hover:underline"
        >
          Buka sumber resmi <ExternalLink size={15} aria-hidden="true" />
        </a>
      </div>
      <div className="space-y-5 px-5 pt-6 sm:px-6">
        <div className="rounded-lg border-l-4 border-[#e2a222] bg-[#fff9e9] px-4 py-3 text-sm leading-6 text-[#5b4a1d]">
          Perubahan halaman belum tentu perubahan ketentuan. Cocokkan tanggal, wilayah, sasaran, dan
          isi kabar pada sumber sebelum menyetujui.
        </div>
        {candidate.evidence_quote ? (
          <div>
            <p className="mb-2 text-sm font-semibold text-[#1b304c]">Kutipan yang ditandai Radar</p>
            <blockquote className="border-l-2 border-[#bdd6f1] pl-4 text-sm leading-6 text-[#526173]">
              {candidate.evidence_quote}
            </blockquote>
          </div>
        ) : (
          <p className="text-sm leading-6 text-[#617087]">
            Kutipan otomatis belum tersedia. Baca dokumen sumber secara langsung sebelum
            menerbitkan.
          </p>
        )}
      </div>
    </>
  );
}
