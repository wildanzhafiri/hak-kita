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
    expect(screen.getAllByText('Kementerian Contoh').length).toBeGreaterThan(0);
    expect(screen.getByRole('heading', { name: 'Persyaratan dan Ketentuan' })).toBeTruthy();
    expect(screen.getByText('Syarat contoh')).toBeTruthy();
    expect(screen.getByRole('heading', { name: 'Cara Mengakses Program' })).toBeTruthy();
    expect(screen.getByRole('heading', { name: 'Periode Pendaftaran' })).toBeTruthy();
    expect(screen.getByRole('heading', { name: 'Sumber Informasi' })).toBeTruthy();
  });

  it('shows requirement sources and keeps documents in their own section', () => {
    renderDetail({ dokumen: ['Fotokopi KTP'] });
    const requirements = screen
      .getByRole('heading', { name: 'Persyaratan dan Ketentuan' })
      .closest('section');
    if (!requirements) throw new Error('Requirements section is missing.');
    expect(within(requirements).getByText('Syarat contoh')).toBeTruthy();
    expect(within(requirements).queryByText('Fotokopi KTP')).toBeNull();
    expect(
      within(requirements).getByRole('link', { name: /Periksa persyaratan secara rinci/ }),
    ).toHaveProperty('href', 'https://contoh.go.id/syarat');
    const documents = screen
      .getByRole('heading', { name: 'Dokumen yang Perlu Disiapkan' })
      .closest('section');
    if (!documents) throw new Error('Documents section is missing.');
    expect(within(documents).getByText('Fotokopi KTP')).toBeTruthy();
  });

  it('explains that desil is decided by the government for desil programs', () => {
    renderDetail({ tipeGerbang: 'desil' });
    expect(screen.getByText(/tidak memeriksa atau menghitung desilmu/)).toBeTruthy();
  });

  it('falls back to the generic steps when the program has none', () => {
    renderDetail();
    expect(screen.getByText('Periksa informasi terbaru melalui kanal resmi.')).toBeTruthy();
  });

  it('shows a custom step in the numbered process', () => {
    renderDetail({ langkah: ['Daftar di situs resmi'] });
    expect(screen.getByText('Daftar di situs resmi')).toBeTruthy();
  });

  it('shows known period and source review date without verification labels', () => {
    renderDetail({ tanggalDiperiksa: '2026-05-01' });
    expect(
      screen.getByText(
        'Jadwal pendaftaran belum dicantumkan. Periksa pengumuman resmi penyelenggara.',
      ),
    ).toBeTruthy();
    expect(screen.getByText('Rujukan terakhir diperiksa 1 Mei 2026.')).toBeTruthy();
    expect(screen.queryByText(/verifikasi/i)).toBeNull();
  });

  it('shows benefit types and announced registration dates', () => {
    renderDetail({
      manfaat: ['Bantuan Biaya Pendidikan'],
      periode: { buka: '2026-02-03', tutup: '2026-11-10' },
    });
    const benefits = screen
      .getByRole('heading', { name: 'Manfaat dan Bentuk Dukungan' })
      .closest('section');
    if (!benefits) throw new Error('Benefits section is missing.');
    expect(within(benefits).getByText('Bantuan Biaya Pendidikan')).toBeTruthy();
    expect(screen.getByText(/3 Februari 2026.*10 November 2026/)).toBeTruthy();
  });

  it('keeps program-only sections off public service details', () => {
    renderDetail({
      jenis: 'layanan',
      kategori: 'Kependudukan & Dokumen Pribadi',
      manfaat: ['Layanan & Pendampingan'],
    });
    expect(screen.queryByRole('heading', { name: 'Manfaat dan Bentuk Dukungan' })).toBeNull();
    expect(screen.queryByRole('heading', { name: 'Periode Pendaftaran' })).toBeNull();
  });

  it('shows service fields in the single-column service layout', () => {
    renderDetail({
      jenis: 'layanan',
      kategori: 'Perpajakan',
      dokumen: ['NPWP'],
      biaya: 'Gratis menurut sumber resmi.',
      kanal: ['online', 'offline'],
      catatan: 'Periksa ketentuan terbaru.',
      tentang: 'Panduan ini untuk wajib pajak orang pribadi.',
    });
    expect(screen.getByRole('heading', { name: 'Ringkasan Layanan' })).toBeTruthy();
    expect(screen.getByText('Panduan ini untuk wajib pajak orang pribadi.')).toBeTruthy();
    expect(screen.getByRole('heading', { name: 'Persyaratan' })).toBeTruthy();
    expect(screen.getByRole('heading', { name: 'Dokumen yang Perlu Disiapkan' })).toBeTruthy();
    expect(screen.getByText('Gratis menurut sumber resmi.')).toBeTruthy();
    expect(screen.getByRole('heading', { name: 'Langkah Pengurusan' })).toBeTruthy();
    expect(screen.getByText('Online dan langsung')).toBeTruthy();
    expect(screen.getByRole('heading', { name: 'Akses Layanan Resmi' })).toBeTruthy();
    expect(screen.getByText('Periksa ketentuan terbaru.')).toBeTruthy();
    expect(screen.getByRole('heading', { name: 'Sumber Informasi' })).toBeTruthy();
  });

  it('omits optional service sections when the data has none', () => {
    renderDetail({ jenis: 'layanan', kategori: 'Perpajakan' });
    expect(screen.queryByRole('heading', { name: 'Ringkasan Layanan' })).toBeNull();
    expect(screen.queryByRole('heading', { name: 'Biaya Resmi' })).toBeNull();
    expect(screen.queryByRole('heading', { name: 'Kanal Pelayanan' })).toBeNull();
    expect(screen.queryByRole('heading', { name: 'Informasi Penting' })).toBeNull();
    expect(screen.queryByRole('heading', { name: 'Panduan Terkait' })).toBeNull();
  });

  it('links related services with their summaries', () => {
    const related = makeProgram({
      id: 'layanan-terkait',
      nama: 'Layanan Terkait',
      ringkasan: 'Ringkasan layanan terkait.',
      jenis: 'layanan',
      kategori: 'Perpajakan',
    });
    render(
      <ProgramDetail
        program={makeProgram({ jenis: 'layanan', kategori: 'Perpajakan' })}
        namaCakupan="Nasional"
        related={[related]}
      />,
    );
    expect(screen.getByRole('heading', { name: 'Panduan Terkait' })).toBeTruthy();
    expect(screen.getByRole('link', { name: /Layanan Terkait/ })).toBeTruthy();
    expect(screen.getByText('Ringkasan layanan terkait.')).toBeTruthy();
  });
});
