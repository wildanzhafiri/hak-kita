import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { makeProgram } from '@/test/fixtures';
import { PeriodChip } from './period-chip';

const PERIODE = { buka: '2026-02-03', tutup: '2026-10-31' };

describe('PeriodChip', () => {
  it('shows the closing date while the period is open', () => {
    render(<PeriodChip program={makeProgram({ periode: PERIODE })} today="2026-10-30" />);
    expect(screen.getByText('Dibuka sampai 31 Oktober 2026').className).toContain('dibuka');
  });

  it('shows closed once the closing date has passed', () => {
    render(<PeriodChip program={makeProgram({ periode: PERIODE })} today="2026-11-01" />);
    expect(screen.getByText('Ditutup 31 Oktober 2026').className).toContain('ditutup');
  });

  it('tells the reader to check official channels when the period is unknown', () => {
    render(<PeriodChip program={makeProgram()} today="2026-10-30" />);
    expect(screen.getByText('Periode: cek kanal resmi')).toBeTruthy();
  });
});
