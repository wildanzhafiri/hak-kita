import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { BUILT_ON, makeProgram } from '@/test/fixtures';
import { ProgramDetail } from './program-detail';

function renderDetail(overrides = {}) {
  return render(
    <ProgramDetail program={makeProgram(overrides)} namaCakupan="Nasional" builtOn={BUILT_ON} />,
  );
}

describe('ProgramDetail', () => {
  it('opens on the summary tab', () => {
    renderDetail();
    expect(screen.getByRole('tab', { name: 'Ringkasan' }).getAttribute('aria-selected')).toBe(
      'true',
    );
    expect(screen.getByText('Kementerian Contoh')).toBeTruthy();
  });

  it('shows requirements from the program data', () => {
    renderDetail({ dokumen: ['Fotokopi KTP'] });
    fireEvent.click(screen.getByRole('tab', { name: 'Persyaratan' }));
    expect(screen.getByText('Syarat contoh')).toBeTruthy();
    expect(screen.getByText('Fotokopi KTP')).toBeTruthy();
  });

  it('explains that desil is decided by the government for desil programs', () => {
    renderDetail({ tipeGerbang: 'desil' });
    fireEvent.click(screen.getByRole('tab', { name: 'Persyaratan' }));
    expect(screen.getByText(/tidak dapat memeriksa maupun menghitung desilmu/)).toBeTruthy();
  });

  it('falls back to the generic steps when the program has none', () => {
    renderDetail();
    fireEvent.click(screen.getByRole('tab', { name: 'Langkah berikutnya' }));
    expect(screen.getByText('Periksa informasi terbaru melalui kanal resmi.')).toBeTruthy();
  });

  it('jumps to the steps tab from the sidebar button', () => {
    renderDetail({ langkah: ['Daftar di situs resmi'] });
    fireEvent.click(screen.getByRole('button', { name: /Lihat cara mengajukan/ }));
    expect(screen.getByText('Daftar di situs resmi')).toBeTruthy();
  });

  it('warns when the last check is stale', () => {
    renderDetail({ tanggalDiperiksa: '2026-05-01' });
    expect(screen.getByText(/Pemeriksaan terakhir sudah lama/)).toBeTruthy();
  });

  it('flags unverified entries', () => {
    renderDetail({ verifikasi: 'belum', tanggalDiperiksa: undefined });
    expect(screen.getByText(/Entri ini belum diverifikasi ke sumber resmi/)).toBeTruthy();
    expect(screen.getByText('Belum diperiksa')).toBeTruthy();
  });
});
