import type { Program } from '@hakkita/schema';
import { daysUntil } from './date';
import { periodStatus } from './period';
import { hasBerkas } from './program';
import type { BerkasEntry, Deadline, NextStep, NextStepInput, PeriodStatus } from './types';

const DEADLINE_RANK: Record<PeriodStatus, number> = {
  dibuka: 0,
  'belum-dibuka': 1,
  'sepanjang-tahun': 2,
  'tidak-diketahui': 3,
  ditutup: 4,
};

export function isBerkasComplete({ readiness, hasUnanswered }: BerkasEntry): boolean {
  return readiness.total > 0 && readiness.ready === readiness.total && !hasUnanswered;
}

export function buildDeadline(program: Program, today: string): Deadline {
  const status = periodStatus(program.periode, today);
  const closesOn = typeof program.periode === 'object' ? program.periode.tutup : null;
  const daysLeft = status === 'dibuka' && closesOn !== null ? daysUntil(closesOn, today) : null;
  return { program, status, closesOn, daysLeft };
}

function sortKey(deadline: Deadline): string {
  const { program, status, closesOn } = deadline;
  if (typeof program.periode !== 'object') return '';
  return status === 'belum-dibuka' ? program.periode.buka : (closesOn ?? '');
}

export function sortDeadlines(deadlines: readonly Deadline[]): Deadline[] {
  return [...deadlines].sort((a, b) => {
    const rank = DEADLINE_RANK[a.status] - DEADLINE_RANK[b.status];
    if (rank !== 0) return rank;
    const byDate = sortKey(a).localeCompare(sortKey(b));
    return a.status === 'ditutup' ? -byDate : byDate;
  });
}

function mostUrgent(entries: readonly BerkasEntry[], today: string): NextStep | null {
  if (entries.length === 0) return null;
  const [first] = sortDeadlines(entries.map((entry) => buildDeadline(entry.program, today)));
  const entry = entries.find((candidate) => candidate.program.id === first?.program.id);
  return entry && first ? { kind: 'continue-berkas', entry, deadline: first } : null;
}

export function pickNextStep({ entries, saved, today }: NextStepInput): NextStep {
  const unfinished = entries.filter((entry) => !isBerkasComplete(entry));
  const urgent = mostUrgent(unfinished, today);
  if (urgent) return urgent;

  const [finished] = entries;
  if (finished) return { kind: 'open-official', program: finished.program };

  const [firstSaved] = saved;
  if (firstSaved) {
    return hasBerkas(firstSaved)
      ? { kind: 'start-berkas', program: firstSaved }
      : { kind: 'review-saved', program: firstSaved };
  }

  return { kind: 'explore' };
}
