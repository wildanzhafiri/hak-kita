import type { Program } from '@hakkita/schema';
import { daysUntil } from './date';
import { periodStatus } from './period';
import type { Deadline, PeriodStatus } from './types';

const DEADLINE_RANK: Record<PeriodStatus, number> = {
  dibuka: 0,
  'belum-dibuka': 1,
  'sepanjang-tahun': 2,
  'tidak-diketahui': 3,
  ditutup: 4,
};

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
