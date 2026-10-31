import {
  berkasPath,
  periodLabel,
  programPath,
  type Deadline,
  type NextStep,
} from '@hakkita/domain';
import { deadlineCaption } from './deadline-caption';
import type { NextStepCopy } from './types';

function deadlineDetail(deadline: Deadline): string {
  const label = periodLabel(deadline.program.periode, deadline.status);
  return deadline.daysLeft === null ? label : `${label} (${deadlineCaption(deadline)})`;
}

export function nextStepCopy(step: NextStep): NextStepCopy {
  switch (step.kind) {
    case 'continue-berkas': {
      const { entry, deadline } = step;
      const remaining = entry.readiness.total - entry.readiness.ready;
      return {
        title: entry.hasUnanswered
          ? `Jawab pertanyaan berkas ${entry.program.nama} dulu.`
          : `Tinggal ${remaining} dokumen untuk ${entry.program.nama}.`,
        detail: deadlineDetail(deadline),
        action: { label: 'Lanjutkan berkas', href: berkasPath(entry.program), external: false },
        readiness: entry.readiness,
      };
    }
    case 'open-official':
      return {
        title: `Semua dokumen ${step.program.nama} sudah siap.`,
        detail:
          'Lanjutkan pengajuan lewat kanal resmi penyelenggara. HAKKITA tidak mengajukan atas namamu.',
        action: { label: 'Buka situs resmi', href: step.program.sumberUtama.url, external: true },
        readiness: null,
      };
    case 'start-berkas':
      return {
        title: `Siapkan berkas untuk ${step.program.nama}.`,
        detail:
          'Kamu sudah menyimpannya. Jawab beberapa pertanyaan untuk melihat dokumen yang perlu disiapkan.',
        action: { label: 'Mulai siapkan berkas', href: berkasPath(step.program), external: false },
        readiness: null,
      };
    case 'review-saved':
      return {
        title: `Baca syarat ${step.program.nama}.`,
        detail: 'Kamu sudah menyimpannya. Pastikan syaratnya cocok sebelum mengurus.',
        action: { label: 'Lihat syarat', href: programPath(step.program), external: false },
        readiness: null,
      };
    case 'explore':
      return {
        title: 'Mulai dari satu program.',
        detail:
          'Simpan program yang menarik atau mulai Berkas Siap Bawa. Progresmu muncul di sini.',
        action: { label: 'Jelajahi program', href: '/kenali-hakmu', external: false },
        readiness: null,
      };
  }
}
