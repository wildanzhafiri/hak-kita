'use client';

import { berkasReadiness, selectDokumen, unansweredQuestions } from '@hakkita/domain';
import { DataNote } from '@/components/ui/data-note';
import { useToday } from '@/hooks/use-today';
import { BerkasChecklist } from './berkas-checklist';
import { BerkasIssues } from './berkas-issues';
import { BerkasNote } from './berkas-note';
import { BerkasPrintHeader } from './berkas-print-header';
import { BerkasQuestions } from './berkas-questions';
import { BerkasSummary } from './berkas-summary';
import type { BerkasSheetProps } from './types';
import { useBerkasProgress } from './use-berkas-progress';

export function BerkasSheet({ program, berkas, builtOn }: BerkasSheetProps) {
  const today = useToday(builtOn);
  const { progress, answer, toggle, setNote, reset } = useBerkasProgress(program.id, berkas);

  const dokumen = selectDokumen(berkas, progress.answers);
  const hasUnanswered = unansweredQuestions(berkas, progress.answers).length > 0;
  const readiness = berkasReadiness(dokumen, progress.checked);

  return (
    <>
      <DataNote>
        Daftar ini disusun dari panduan resmi penyelenggara dan bisa berubah. Pastikan lagi melalui
        kanal resmi sebelum mengunggah atau mengajukan.
      </DataNote>
      <div className="detail-layout">
        <div>
          <BerkasPrintHeader program={program} today={today} />
          {berkas.pertanyaan.length > 0 && (
            <section className="panel no-print">
              <h2>Mulai dari kondisimu</h2>
              <BerkasQuestions
                questions={berkas.pertanyaan}
                answers={progress.answers}
                onAnswer={answer}
              />
            </section>
          )}
          <section className="panel">
            <h2>Yang perlu kamu siapkan</h2>
            <BerkasChecklist
              dokumen={dokumen}
              checked={progress.checked}
              hasUnanswered={hasUnanswered}
              onToggle={toggle}
            />
          </section>
          {berkas.kendala.length > 0 && (
            <section className="panel">
              <h2>Kalau kamu mentok</h2>
              <BerkasIssues kendala={berkas.kendala} />
            </section>
          )}
          <section className="panel">
            <BerkasNote note={progress.note} onChange={setNote} />
          </section>
        </div>
        <BerkasSummary program={program} readiness={readiness} onReset={reset} />
      </div>
    </>
  );
}
