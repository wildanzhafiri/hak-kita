import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { APBN_METRICS, ANGGARAN_CONTENT } from './content';
import { BudgetOverview } from './budget-overview';

const composition = [
  { label: 'Belanja Pegawai', allocation: 506149.33, realization: 361365.08 },
  { label: 'Belanja Barang dan Jasa', allocation: 381466, realization: 215491.89 },
  { label: 'Belanja Modal', allocation: 156012.68, realization: 56302.1 },
  { label: 'Belanja Lainnya', allocation: 223047.32, realization: 121204.75 },
];

describe('BudgetOverview', () => {
  it('shows the APBN snapshot and the APBD allocation and realization chart', () => {
    render(
      <BudgetOverview
        metrics={APBN_METRICS}
        year={2026}
        period="Desember 2026"
        dataReceived="31 Oktober 2026"
        composition={composition}
      />,
    );

    expect(screen.getByRole('heading', { name: 'Ringkasan APBN 2026' })).toBeTruthy();
    expect(screen.getByText('Rp2.341,5 T')).toBeTruthy();
    expect(screen.getByRole('heading', { name: 'Komposisi Belanja Daerah 2026' })).toBeTruthy();
    expect(screen.getByText('Alokasi')).toBeTruthy();
    expect(screen.getByText('Realisasi')).toBeTruthy();
    expect(screen.getByText('506.149,33')).toBeTruthy();
    expect(screen.getByText('361.365,08')).toBeTruthy();
    expect(
      screen.getByText(
        'Data diterima SIKD per 31 Oktober 2026. Realisasi APBD s.d. Desember 2026. Grafik diperbarui otomatis setiap jam mengikuti data yang tersedia di sumber resmi.',
      ),
    ).toBeTruthy();
  });

  it('links to official APBN and APBD sources', () => {
    render(
      <BudgetOverview
        metrics={APBN_METRICS}
        year={2026}
        period="Desember 2026"
        dataReceived="31 Oktober 2026"
        composition={composition}
      />,
    );

    expect(
      screen
        .getByRole('link', { name: /APBN KiTa edisi Oktober 2026 di situs Kementerian Keuangan/ })
        .getAttribute('href'),
    ).toBe('https://www.kemenkeu.go.id/APBNKITAOktober2026');
    expect(
      screen
        .getByRole('link', { name: /Portal Data SIKD, DJPK Kementerian Keuangan/ })
        .getAttribute('href'),
    ).toBe(ANGGARAN_CONTENT.apbdSourceUrl);
    expect(screen.getByRole('link', { name: 'Buka data APBD' }).getAttribute('href')).toBe(
      ANGGARAN_CONTENT.apbdSourceUrl,
    );
  });
});
