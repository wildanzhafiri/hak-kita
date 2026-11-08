import type { Program } from '@hakkita/schema';
import { daysUntil } from './date';
import type { ProgramChange, ProgramFollowSnapshot } from './types';
import { periodStatus } from './period';

const CLOSING_SOON_DAYS = 7;

export function shouldNotifyProgramNews(
  newsCreatedAt: string,
  followedAt: string,
  emailEnabledAt: string,
): boolean {
  return newsCreatedAt > followedAt && newsCreatedAt > emailEnabledAt;
}

export function createProgramFollowSnapshot(
  program: Program,
  today: string,
): ProgramFollowSnapshot {
  return {
    periode: program.periode ?? null,
    periodStatus: periodStatus(program.periode, today),
    closingSoon:
      typeof program.periode === 'object' &&
      daysUntil(program.periode.tutup, today) >= 0 &&
      daysUntil(program.periode.tutup, today) <= CLOSING_SOON_DAYS,
    syarat: program.syarat.map(({ teks }) => teks).sort(),
    dokumen: [
      ...program.dokumen,
      ...(program.berkas?.dokumen.map(({ label }) => label) ?? []),
    ].sort(),
    verifikasi: program.verifikasi,
  };
}

export function getProgramChanges(
  previous: ProgramFollowSnapshot,
  program: Program,
  today: string,
): ProgramChange[] {
  if (program.verifikasi === 'belum') return [];
  const current = createProgramFollowSnapshot(program, today);
  const changes: ProgramChange[] = [];
  if (JSON.stringify(previous.periode) !== JSON.stringify(current.periode)) {
    changes.push('periode');
  } else if (previous.periodStatus !== current.periodStatus) {
    if (current.periodStatus === 'dibuka') changes.push('dibuka');
    if (current.periodStatus === 'ditutup') changes.push('ditutup');
  }
  if (!previous.closingSoon && current.closingSoon && !changes.includes('periode')) {
    changes.push('tenggat');
  }
  if (JSON.stringify([...previous.syarat].sort()) !== JSON.stringify(current.syarat)) {
    changes.push('syarat');
  }
  if (JSON.stringify([...previous.dokumen].sort()) !== JSON.stringify(current.dokumen)) {
    changes.push('dokumen');
  }
  if (previous.verifikasi !== current.verifikasi && current.verifikasi !== 'belum') {
    changes.push('verifikasi');
  }
  return changes;
}
