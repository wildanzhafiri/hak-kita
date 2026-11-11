'use client';

import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Dialog } from '@/components/ui/dialog';
import { TextAreaInput } from '@/components/ui/text-area';
import { TextInput } from '@/components/ui/text-input';
import { RadarCandidateContext } from './radar-candidate-context';
import type { RadarCandidateCardProps } from './types';
import { useRadarCandidateReview } from './use-radar-candidate-review';

export function RadarCandidateCard({ candidate, onReviewed }: RadarCandidateCardProps) {
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
    handleApprove,
    rejectCandidate,
  } = useRadarCandidateReview({ candidate, onReviewed });

  return (
    <article className="overflow-hidden rounded-xl border border-[#dce1e6] bg-white">
      <RadarCandidateContext candidate={candidate} />

      <form onSubmit={handleApprove} className="space-y-5 px-5 py-6 sm:px-6">
        <div className="grid gap-5 md:grid-cols-[1fr_190px]">
          <label className="block space-y-2 text-sm font-semibold text-[#1b304c]">
            Judul kabar
            <TextInput
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              required
              minLength={8}
              maxLength={180}
            />
          </label>
          <label className="block space-y-2 text-sm font-semibold text-[#1b304c]">
            Tanggal terbit
            <TextInput
              type="date"
              value={publishedOn}
              onChange={(event) => setPublishedOn(event.target.value)}
              required
            />
          </label>
        </div>
        <label className="block space-y-2 text-sm font-semibold text-[#1b304c]">
          Ringkasan yang tampil di HAKKITA
          <TextAreaInput
            value={summary}
            onChange={(event) => setSummary(event.target.value)}
            required
            minLength={20}
            maxLength={600}
          />
        </label>
        <label className="block space-y-2 text-sm font-semibold text-[#1b304c]">
          Isi utama email
          <TextAreaInput
            value={emailText}
            onChange={(event) => setEmailText(event.target.value)}
            required
            minLength={20}
            maxLength={1200}
          />
        </label>
        <label className="block space-y-2 text-sm font-semibold text-[#1b304c]">
          Sumber resmi tambahan, satu URL per baris
          <TextAreaInput
            value={extraSources}
            onChange={(event) => setExtraSources(event.target.value)}
            placeholder="https://instansi.go.id/pengumuman"
          />
        </label>
        <Checkbox isSelected={isConfirmed} onChange={setIsConfirmed}>
          Saya sudah membuka sumber dan memeriksa setiap klaim, tanggal, serta tautan tambahan.
        </Checkbox>
        {error && (
          <p role="alert" className="text-sm text-[#b72f35]">
            {error}
          </p>
        )}
        <div className="flex flex-col gap-3 border-t border-[#e1e7ee] pt-5 sm:flex-row sm:justify-end">
          <Button
            tone="secondary"
            type="button"
            onPress={() => setIsRejectOpen(true)}
            isDisabled={isBusy}
          >
            Tolak temuan
          </Button>
          <Button type="submit" isDisabled={isBusy || !isConfirmed}>
            {isBusy ? 'Menyimpan...' : 'Setujui dan terbitkan'}
          </Button>
        </div>
      </form>

      <Dialog
        trigger={null}
        open={isRejectOpen}
        onOpenChange={setIsRejectOpen}
        title="Tolak temuan ini?"
        description="Temuan akan keluar dari antrean tanpa tampil kepada pengguna atau dikirim lewat email."
        closeLabel="Tutup konfirmasi"
      >
        <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
          <Button tone="secondary" onPress={() => setIsRejectOpen(false)}>
            Batal
          </Button>
          <Button tone="danger" isDisabled={isBusy} onPress={rejectCandidate}>
            Ya, tolak
          </Button>
        </div>
      </Dialog>
    </article>
  );
}
