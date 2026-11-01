import { render, screen, within } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import type { Program } from '@hakkita/schema';
import { makeProgram } from '@/test/fixtures';
import { ProgramDetail } from './program-detail';

function renderDetail(overrides: Partial<Program> = {}) {
  return render(<ProgramDetail program={makeProgram(overrides)} namaCakupan="Nasional" />);
}

describe('ProgramDetail', () => {
  it('shows the program summary, requirements, and steps together', () => {
    renderDetail();
    expect(screen.getByRole('heading', { name: 'Program Contoh' })).toBeTruthy();
    expect(screen.getByText('Kementerian Contoh')).toBeTruthy();
    expect(screen.getByRole('heading', { name: 'Persyaratan dan dokumen' })).toBeTruthy();
    expect(screen.getByText('Syarat contoh')).toBeTruthy();
    expect(screen.getByRole('heading', { name: 'Langkah pengurusan' })).toBeTruthy();
  });

  it('numbers requirements and documents as separate lists', () => {
    renderDetail({ dokumen: ['Fotokopi KTP'] });
    const requirements = screen
      .getByRole('heading', { name: 'Persyaratan dan dokumen' })
      .closest('section');
    if (!requirements) throw new Error('Requirements section is missing.');
    expect(within(requirements).getByText('Syarat contoh')).toBeTruthy();
    expect(within(requirements).getByText('Fotokopi KTP')).toBeTruthy();
    const numberedLists = within(requirements)
      .getAllByRole('list')
      .filter((list) => list.tagName === 'OL');
    expect(numberedLists).toHaveLength(2);
  });

  it('explains that desil is decided by the government for desil programs', () => {
    renderDetail({ tipeGerbang: 'desil' });
    expect(screen.getByText(/tidak dapat memeriksa maupun menghitung desilmu/)).toBeTruthy();
  });

  it('falls back to the generic steps when the program has none', () => {
    renderDetail();
    expect(screen.getByText('Periksa informasi terbaru melalui kanal resmi.')).toBeTruthy();
  });

  it('shows a custom step in the numbered process', () => {
    renderDetail({ langkah: ['Daftar di situs resmi'] });
    expect(screen.getByText('Daftar di situs resmi')).toBeTruthy();
  });

  it('hides period and verification labels temporarily', () => {
    renderDetail({ tanggalDiperiksa: '2026-05-01' });
    expect(screen.queryByText('Periode')).toBeNull();
    expect(screen.queryByText(/verifikasi/i)).toBeNull();
    expect(screen.queryByText(/Diperiksa/)).toBeNull();
  });
});
