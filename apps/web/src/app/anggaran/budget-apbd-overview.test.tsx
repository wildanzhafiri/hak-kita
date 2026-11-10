import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import type { ApbdBudgetSnapshot } from '@/server/types';
import { ApbdBudgetOverview } from './budget-apbd-overview';

const snapshot: ApbdBudgetSnapshot = {
  year: 2026,
  period: 'November 2026',
  periodNumber: 11,
  dataReceived: '10 November 2026',
  regionLabel: 'Kab. Bandung',
  sourceUrl:
    'https://djpk.kemenkeu.go.id/portal/data/apbd?pemda=01&periode=11&provinsi=10&tahun=2026',
  totalAllocation: 6142.47,
  totalRealization: 3810.39,
  realizationPercent: 62.03,
  categories: [
    { label: 'Belanja Pegawai', allocation: 3100, realization: 2200 },
    { label: 'Belanja Barang dan Jasa', allocation: 1800, realization: 1000 },
    { label: 'Belanja Modal', allocation: 600, realization: 250 },
    { label: 'Belanja Lainnya', allocation: 642.47, realization: 360.39 },
  ],
  expenses: [
    {
      label: 'Belanja Daerah',
      allocation: 6142.47,
      realization: 3810.39,
      realizationPercent: 62.03,
    },
  ],
  revenues: [
    {
      label: 'Pendapatan Daerah',
      allocation: 7000,
      realization: 5000,
      realizationPercent: 71.43,
    },
  ],
};

describe('ApbdBudgetOverview', () => {
  it('shows source period, reporting region, allocation and realization', () => {
    render(<ApbdBudgetOverview snapshot={snapshot} />);

    expect(screen.getByText('Rp6.142,5 M')).toBeTruthy();
    expect(screen.getByText('Rp3.810,4 M')).toBeTruthy();
    expect(screen.getAllByText(/Kab\. Bandung/).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/November 2026/).length).toBeGreaterThan(0);
    expect(screen.getByRole('heading', { name: 'Ke Mana Anggaran Dialokasikan?' })).toBeTruthy();
  });

  it('links the breakdown to the selected official SIKD region', () => {
    render(<ApbdBudgetOverview snapshot={snapshot} />);

    fireEvent.click(screen.getByRole('button', { name: 'Sumber informasi' }));

    expect(
      screen
        .getByRole('link', { name: /Portal Data SIKD, DJPK Kementerian Keuangan/ })
        .getAttribute('href'),
    ).toBe(snapshot.sourceUrl);
  });
});
