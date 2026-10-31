import { MONTH_NAMES, MS_PER_DAY } from './constants';

export function todayWIB(now: Date = new Date()): string {
  return new Intl.DateTimeFormat('en-CA', { timeZone: 'Asia/Jakarta' }).format(now);
}

export function formatDate(iso: string): string {
  const [year, month, day] = iso.split('-');
  const monthName = MONTH_NAMES[Number(month) - 1];
  if (!year || !day || !monthName) return iso;
  return `${Number(day)} ${monthName} ${year}`;
}

function toUtcMs(iso: string): number {
  const [year, month, day] = iso.split('-').map(Number);
  return Date.UTC(year ?? 1970, (month ?? 1) - 1, day ?? 1);
}

export function daysUntil(date: string, today: string): number {
  return Math.floor((toUtcMs(date) - toUtcMs(today)) / MS_PER_DAY);
}

export function daysSince(date: string, today: string): number {
  return Math.floor((toUtcMs(today) - toUtcMs(date)) / MS_PER_DAY);
}
