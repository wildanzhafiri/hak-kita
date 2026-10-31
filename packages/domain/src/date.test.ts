import { describe, expect, it } from 'vitest';
import { daysSince, daysUntil, formatDate, todayWIB } from './date';

describe('formatDate', () => {
  it('formats an ISO date in Indonesian', () => {
    expect(formatDate('2026-10-31')).toBe('31 Oktober 2026');
    expect(formatDate('2026-01-05')).toBe('5 Januari 2026');
  });

  it('returns malformed input unchanged', () => {
    expect(formatDate('rusak')).toBe('rusak');
  });
});

describe('daysSince', () => {
  it('counts whole days between two dates', () => {
    expect(daysSince('2026-10-01', '2026-10-30')).toBe(29);
    expect(daysSince('2026-10-30', '2026-10-30')).toBe(0);
  });

  it('crosses month and year boundaries', () => {
    expect(daysSince('2025-12-31', '2026-01-01')).toBe(1);
  });
});

describe('daysUntil', () => {
  it('counts days left until a date and goes negative once it has passed', () => {
    expect(daysUntil('2026-10-31', '2026-10-30')).toBe(1);
    expect(daysUntil('2026-10-30', '2026-10-30')).toBe(0);
    expect(daysUntil('2026-10-29', '2026-10-30')).toBe(-1);
  });
});

describe('todayWIB', () => {
  it('uses the Jakarta date, not the UTC date', () => {
    expect(todayWIB(new Date('2026-10-30T18:00:00Z'))).toBe('2026-10-31');
    expect(todayWIB(new Date('2026-10-30T16:59:00Z'))).toBe('2026-10-30');
  });
});
