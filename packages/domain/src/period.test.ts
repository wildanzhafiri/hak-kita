import { describe, expect, it } from 'vitest';
import { periodLabel, periodStatus } from './period';

const PERIODE = { buka: '2026-02-03', tutup: '2026-10-31' };

describe('periodStatus', () => {
  it('recognises open, closed, and not yet open periods', () => {
    expect(periodStatus(PERIODE, '2026-05-01')).toBe('dibuka');
    expect(periodStatus(PERIODE, '2026-11-11')).toBe('ditutup');
    expect(periodStatus(PERIODE, '2026-01-01')).toBe('belum-dibuka');
  });

  it('treats the first and last day as open', () => {
    expect(periodStatus(PERIODE, '2026-02-03')).toBe('dibuka');
    expect(periodStatus(PERIODE, '2026-10-31')).toBe('dibuka');
  });

  it('treats the day after the last day as closed', () => {
    expect(periodStatus(PERIODE, '2026-11-01')).toBe('ditutup');
  });

  it('handles year-round and unknown periods', () => {
    expect(periodStatus('sepanjang-tahun', '2026-10-30')).toBe('sepanjang-tahun');
    expect(periodStatus(undefined, '2026-10-30')).toBe('tidak-diketahui');
  });
});

describe('periodLabel', () => {
  it('names the relevant date for each status', () => {
    expect(periodLabel(PERIODE, 'dibuka')).toBe('Dibuka sampai 31 Oktober 2026');
    expect(periodLabel(PERIODE, 'ditutup')).toBe('Ditutup 31 Oktober 2026');
    expect(periodLabel(PERIODE, 'belum-dibuka')).toBe('Dibuka 3 Februari 2026');
  });

  it('falls back to plain text when there is no date range', () => {
    expect(periodLabel('sepanjang-tahun', 'sepanjang-tahun')).toBe('Sepanjang tahun');
    expect(periodLabel(undefined, 'tidak-diketahui')).toBe('Periode: cek kanal resmi');
    expect(periodLabel('sepanjang-tahun', 'dibuka')).toBe('Dibuka');
  });
});
