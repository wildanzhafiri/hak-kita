import { fireEvent, render, screen, within } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { BUILT_ON, makeProgram } from '@/test/fixtures';
import { ProgramDetail } from './program-detail';

function renderDetail(overrides = {}) {
  return render(
    <ProgramDetail program={makeProgram(overrides)} namaCakupan="Nasional" builtOn={BUILT_ON} />,
  );
}

describe('ProgramDetail', () => {
  it('shows the summary tab first and hides the other panels', () => {
    renderDetail();
    expect(screen.getByRole('tab', { name: 'Ringkasan', selected: true })).toBeTruthy();
    expect(within(screen.getByRole('tabpanel')).getByText('Kementerian Contoh')).toBeTruthy();
    expect(screen.queryByRole('heading', { name: 'Persyaratan dan dokumen' })).toBeNull();
  });

  it('numbers requirements and documents separately', () => {
    renderDetail({ dokumen: ['Fotokopi KTP'] });
    fireEvent.click(screen.getByRole('tab', { name: 'Persyaratan' }));
    const requirements = screen.getByRole('tabpanel');
    expect(within(requirements).getByText('Syarat contoh')).toBeTruthy();
    expect(within(requirements).getByText('Fotokopi KTP')).toBeTruthy();
    const numberedLists = within(requirements)
      .getAllByRole('list')
      .filter((list) => list.tagName === 'OL');
    expect(numberedLists).toHaveLength(2);
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

  it('switches tabs with arrow keys and shows the chosen panel', () => {
    renderDetail({ langkah: ['Daftar di situs resmi'] });
    const summaryTab = screen.getByRole('tab', { name: 'Ringkasan' });
    summaryTab.focus();
    fireEvent.keyDown(summaryTab, { key: 'ArrowRight' });
    expect(screen.getByRole('tab', { name: 'Persyaratan', selected: true })).toBeTruthy();
    fireEvent.click(screen.getByRole('tab', { name: 'Langkah berikutnya' }));
    expect(within(screen.getByRole('tabpanel')).getByText('Daftar di situs resmi')).toBeTruthy();
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
