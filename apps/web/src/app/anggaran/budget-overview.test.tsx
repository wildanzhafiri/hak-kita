import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { APBN_SOURCES } from './content';
import { BudgetOverview } from './budget-overview';

describe('BudgetOverview', () => {
  it('shows the verified APBN snapshot and functional breakdown', () => {
    render(<BudgetOverview />);

    expect(screen.getByText('Rp3.842,7 T')).toBeTruthy();
    expect(screen.getByText('Rp2.660,5 T')).toBeTruthy();
    expect(screen.getByRole('heading', { name: 'Ke Mana Anggaran Dialokasikan?' })).toBeTruthy();
    expect(screen.getByRole('heading', { name: 'Ekonomi' })).toBeTruthy();
    expect(screen.getByRole('button', { name: /Pendidikan/ })).toBeTruthy();
  });

  it('updates the selected field and exposes all eleven functions', () => {
    render(<BudgetOverview />);

    fireEvent.click(screen.getByRole('button', { name: /Pendidikan/ }));

    expect(screen.getByRole('heading', { name: 'Pendidikan' })).toBeTruthy();
    expect(screen.getAllByText('Rp459,7 T').length).toBeGreaterThan(0);

    fireEvent.click(screen.getByRole('button', { name: /Lihat seluruh bidang/ }));

    expect(screen.getByRole('button', { name: /Pariwisata/ })).toBeTruthy();
  });

  it('links the source list to the official APBN publications', () => {
    render(<BudgetOverview />);

    fireEvent.click(screen.getByRole('button', { name: 'Sumber informasi' }));

    expect(
      screen.getByRole('link', { name: /UU Nomor 17 Tahun 2025, Lampiran I/ }).getAttribute('href'),
    ).toBe(APBN_SOURCES[1]?.url);
  });

  it('opens spending and revenue details with their official figures', () => {
    render(<BudgetOverview />);

    fireEvent.click(
      screen.getByRole('button', { name: 'Belanja Pemerintah Pusat dan Transfer ke Daerah' }),
    );

    expect(screen.getByRole('columnheader', { name: 'Realisasi (%)' })).toBeTruthy();
    expect(screen.getByText('Rp2.061,3 T')).toBeTruthy();

    fireEvent.click(screen.getByRole('button', { name: 'Rincian pendapatan' }));

    expect(screen.getByText('Rp2.341,5 T')).toBeTruthy();
  });
});
