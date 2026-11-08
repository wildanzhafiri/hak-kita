'use client';

import Link from 'next/link';
import { ProgressMeter } from '@/components/ui/progress-meter';
import { BerkasMiniRow } from './berkas-mini-row';
import { PROGRESS_NOTE, SUMMARY_PREVIEW_COUNT } from './constants';
import { DeadlineRow } from './deadline-row';
import { NextStepCard } from './next-step-card';
import { RencanaStepGuide } from './rencana-step-guide';
import { RencanaFollowUpdates } from './rencana-follow-updates';
import { useRencanaState } from './rencana-context';
import type { RencanaSummaryProps } from './types';

export function RencanaSummary({ isEmailAvailable = false }: RencanaSummaryProps) {
  const { programs, nextStep, entries, deadlines, overall, guided } = useRencanaState();

  return (
    <>
      <NextStepCard step={nextStep} />
      <RencanaFollowUpdates programs={programs} isEmailAvailable={isEmailAvailable} />
      {guided.length > 0 && (
        <section
          id="panduan-langkah"
          className="grid gap-5 scroll-mt-28"
          aria-labelledby="panduan-langkah-title"
        >
          <div>
            <h2 id="panduan-langkah-title" className="text-2xl font-bold text-[#1b304c]">
              Panduan langkahmu
            </h2>
            <p className="mt-2 text-sm leading-6 text-[#617087]">
              Tandai langkah yang sudah kamu lakukan. Progres ini kamu isi sendiri dan bukan status
              pengajuan di kanal pemerintah.
            </p>
          </div>
          {guided.map((program) => (
            <RencanaStepGuide key={program.id} program={program} />
          ))}
        </section>
      )}
      {entries.length > 1 && (
        <section className="panel">
          <h2>Kesiapan semua berkas</h2>
          <ProgressMeter
            value={overall.ready}
            max={overall.total}
            summary={`${overall.ready} dari ${overall.total} dokumen siap di ${entries.length} berkas`}
            label="Kesiapan semua berkas"
          />
          <p className="small-note">{PROGRESS_NOTE}</p>
        </section>
      )}
      <div className="summary-columns">
        <section>
          <div className="summary-head">
            <h2>Berkas</h2>
            <Link className="text-link" href="/rencanaku/berkas">
              Lihat semua
            </Link>
          </div>
          {entries.length > 0 ? (
            <ul className="mini-list">
              {entries.slice(0, SUMMARY_PREVIEW_COUNT).map((entry) => (
                <BerkasMiniRow key={entry.program.id} entry={entry} />
              ))}
            </ul>
          ) : (
            <p className="empty-hint">Belum ada berkas yang kamu siapkan.</p>
          )}
        </section>
        <section>
          <div className="summary-head">
            <h2>Tenggat terdekat</h2>
            <Link className="text-link" href="/rencanaku/tenggat">
              Lihat semua
            </Link>
          </div>
          {deadlines.length > 0 ? (
            <ul className="deadline-list">
              {deadlines.slice(0, SUMMARY_PREVIEW_COUNT).map((deadline) => (
                <DeadlineRow key={deadline.program.id} deadline={deadline} />
              ))}
            </ul>
          ) : (
            <p className="empty-hint">Simpan program atau mulai berkas untuk melihat tenggatnya.</p>
          )}
        </section>
      </div>
    </>
  );
}
