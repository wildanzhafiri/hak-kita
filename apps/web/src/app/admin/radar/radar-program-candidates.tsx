'use client';

import { useState } from 'react';
import { ExternalLink, Radio } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Dialog } from '@/components/ui/dialog';
import type { RadarProgramCandidatesProps } from './types';

export function RadarProgramCandidates({ initialCandidates }: RadarProgramCandidatesProps) {
  const [candidates, setCandidates] = useState(initialCandidates);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [rejectId, setRejectId] = useState<string | null>(null);
  const [confirmedIds, setConfirmedIds] = useState<string[]>([]);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  async function review(candidateId: string, action: 'approve' | 'reject') {
    const candidate = candidates.find((entry) => entry.id === candidateId);
    if (!candidate || busyId) return;
    setBusyId(candidateId);
    setErrorMessage(null);
    try {
      const response = await fetch('/api/admin/radar/programs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action,
          candidateId,
          ...(action === 'approve' ? { program: candidate.record.program } : {}),
        }),
      });
      if (!response.ok) {
        setErrorMessage('Tinjauan belum tersimpan. Muat ulang antrean lalu coba lagi.');
        return;
      }
      setCandidates((current) => current.filter((entry) => entry.id !== candidateId));
    } catch {
      setErrorMessage('Koneksi terputus. Coba simpan tinjauan lagi.');
    } finally {
      setBusyId(null);
    }
  }

  return (
    <section className="mt-10 flex flex-col gap-4" aria-labelledby="program-candidates-heading">
      <div>
        <h2 className="text-xl font-semibold text-[#253044]" id="program-candidates-heading">
          Kandidat program baru
        </h2>
        <p className="mt-1 text-sm leading-6 text-[#64748b]">
          Draf dari pencarian sumber resmi. Persetujuan hanya menyimpan informasi sebagai belum
          diverifikasi; program baru belum tampil kepada pengguna.
        </p>
      </div>
      {errorMessage && (
        <p className="text-sm text-[#a72b32]" role="alert">
          {errorMessage}
        </p>
      )}
      {candidates.length === 0 ? (
        <div className="flex min-h-[160px] items-center gap-4 rounded-xl border border-[#dce4ed] bg-white px-6 py-7">
          <span className="grid size-11 shrink-0 place-items-center rounded-xl bg-[#eef5fc] text-[#196dcc]">
            <Radio aria-hidden="true" size={22} />
          </span>
          <p className="text-sm text-[#526173]">Belum ada kandidat program baru untuk diperiksa.</p>
        </div>
      ) : (
        candidates.map((candidate) => (
          <article
            className="flex flex-col gap-5 rounded-xl border border-[#dce4ed] bg-white p-5 sm:p-6"
            key={candidate.id}
          >
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h3 className="text-lg font-semibold text-[#253044]">
                  {candidate.record.program.nama}
                </h3>
                <span className="rounded-full border border-[#f1d49a] bg-[#fff7e7] px-3 py-1 text-xs font-semibold text-[#805810]">
                  Belum diverifikasi
                </span>
              </div>
              <p className="mt-1 text-sm text-[#64748b]">
                {candidate.record.program.penyelenggara} · {candidate.record.program.kategori}
              </p>
              <p className="mt-3 text-sm leading-6 text-[#475569]">
                {candidate.record.program.ringkasan}
              </p>
            </div>
            <div className="[display:grid] gap-5 lg:grid-cols-2">
              <div>
                <h4 className="text-sm font-semibold text-[#334155]">Sumber yang ditemukan</h4>
                <ul className="mt-2 flex flex-col gap-2">
                  {candidate.record.evidence.map((evidence) => (
                    <li key={evidence.url}>
                      <a
                        className="inline-flex items-center gap-1.5 break-all text-sm font-medium text-[#1769c2] underline"
                        href={evidence.url}
                        rel="noreferrer"
                        target="_blank"
                      >
                        {evidence.url}
                        <ExternalLink aria-hidden="true" size={14} />
                      </a>
                      <blockquote className="mt-1 border-l-2 border-[#c8d8e9] pl-3 text-sm leading-6 text-[#526173]">
                        {evidence.quote}
                      </blockquote>
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <h4 className="text-sm font-semibold text-[#334155]">Persyaratan draf</h4>
                <ul className="mt-2 flex list-disc flex-col gap-1 pl-5 text-sm leading-6 text-[#526173]">
                  {candidate.record.program.syarat.map((requirement, index) => (
                    <li key={`${requirement.teks}-${index}`}>{requirement.teks}</li>
                  ))}
                </ul>
              </div>
            </div>
            <div className="flex flex-wrap justify-end gap-3 border-t border-[#e1e9f2] pt-4">
              <Button
                isDisabled={busyId !== null}
                onPress={() => setRejectId(candidate.id)}
                tone="secondary"
                type="button"
              >
                Tolak
              </Button>
              <Button
                isDisabled={busyId !== null || !confirmedIds.includes(candidate.id)}
                onPress={() => void review(candidate.id, 'approve')}
                type="button"
              >
                {busyId === candidate.id ? 'Menyimpan' : 'Setujui sebagai draf'}
              </Button>
            </div>
            <Checkbox
              isSelected={confirmedIds.includes(candidate.id)}
              onChange={(isSelected) =>
                setConfirmedIds((current) =>
                  isSelected
                    ? [...current, candidate.id]
                    : current.filter((candidateId) => candidateId !== candidate.id),
                )
              }
            >
              Saya sudah membuka sumber dan memeriksa nama, syarat, periode, wilayah, dan kutipan.
            </Checkbox>
            <Dialog
              trigger={null}
              open={rejectId === candidate.id}
              onOpenChange={(isOpen) => setRejectId(isOpen ? candidate.id : null)}
              title="Tolak kandidat ini?"
              description="Kandidat akan keluar dari antrean dan tidak disimpan sebagai informasi HAKKITA."
              closeLabel="Tutup konfirmasi"
            >
              <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
                <Button onPress={() => setRejectId(null)} tone="secondary" type="button">
                  Batal
                </Button>
                <Button
                  isDisabled={busyId !== null}
                  onPress={() => {
                    setRejectId(null);
                    void review(candidate.id, 'reject');
                  }}
                  tone="danger"
                  type="button"
                >
                  Ya, tolak
                </Button>
              </div>
            </Dialog>
          </article>
        ))
      )}
    </section>
  );
}
