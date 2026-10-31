import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { ProgressMeter } from './progress-meter';

describe('ProgressMeter', () => {
  it('draws one segment per document and fills the ones that are ready', () => {
    render(<ProgressMeter value={2} max={5} summary="2 dari 5 dokumen siap" label="Kesiapan" />);
    const bar = screen.getByRole('progressbar', { name: 'Kesiapan' });
    expect(bar.children).toHaveLength(5);
    expect(bar.querySelectorAll('.filled')).toHaveLength(2);
    expect(bar.getAttribute('aria-valuenow')).toBe('2');
    expect(bar.getAttribute('aria-valuemax')).toBe('5');
    expect(screen.getByText('40%')).toBeTruthy();
  });

  it('falls back to a continuous bar when there are too many segments', () => {
    render(<ProgressMeter value={15} max={30} summary="15 dari 30" label="Kesiapan" />);
    const bar = screen.getByRole('progressbar');
    expect(bar.children).toHaveLength(1);
    expect(screen.getByText('50%')).toBeTruthy();
  });

  it('shows an empty bar at zero percent when there is nothing to prepare', () => {
    render(<ProgressMeter value={0} max={0} summary="Belum ada dokumen" label="Kesiapan" />);
    const bar = screen.getByRole('progressbar');
    expect(bar.getAttribute('aria-valuenow')).toBe('0');
    expect(bar.querySelector('.filled')).toBeNull();
    expect(screen.getByText('0%')).toBeTruthy();
  });
});
