import { fireEvent, render, screen, within } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import type { Program } from '@hakkita/schema';
import { ProgramList } from './program-list';

const programs: Program[] = [
  {
    id: 'program-lengkap',
    nama: 'Program Lengkap',
    jenis: 'program',
    kategori: 'Pendidikan',
    penyelenggara: 'Kementerian Pendidikan',
    ringkasan: 'Informasi program yang sudah diperiksa lengkap.',
    untuk: ['Mahasiswa'],
    cakupan: { level: 'nasional', kode: 'ID' },
    tipeGerbang: 'kategori',
    syarat: [{ teks: 'Memenuhi kriteria program', sumberUrl: 'https://example.go.id' }],
    langkah: [],
    dokumen: [],
    sumberUtama: { url: 'https://example.go.id', jenis: 'situs-resmi' },
    sumberTambahan: [],
    verifikasi: 'lengkap',
    tanggalDiperiksa: '2026-11-10',
  },
  {
    id: 'program-dasar',
    nama: 'Program Dasar',
    jenis: 'program',
    kategori: 'Pekerjaan & Pelatihan',
    penyelenggara: 'Kementerian Ketenagakerjaan',
    ringkasan: 'Informasi program yang perlu diperiksa kembali.',
    untuk: ['Pencari kerja'],
    cakupan: { level: 'nasional', kode: 'ID' },
    tipeGerbang: 'kategori',
    syarat: [{ teks: 'Memenuhi kriteria program', sumberUrl: 'https://example.go.id' }],
    langkah: [],
    dokumen: [],
    sumberUtama: { url: 'https://example.go.id/program', jenis: 'situs-resmi' },
    sumberTambahan: [],
    verifikasi: 'dasar',
    tanggalDiperiksa: '2026-11-09',
  },
  {
    id: 'layanan-administrasi',
    nama: 'Layanan Administrasi',
    jenis: 'layanan',
    kategori: 'Layanan Administrasi',
    penyelenggara: 'Dinas Pemerintahan',
    ringkasan: 'Informasi layanan administrasi yang tersedia untuk warga.',
    untuk: ['Penduduk'],
    cakupan: { level: 'nasional', kode: 'ID' },
    tipeGerbang: 'prosedur',
    syarat: [{ teks: 'Mengikuti prosedur layanan', sumberUrl: 'https://example.go.id' }],
    langkah: [],
    dokumen: [],
    sumberUtama: { url: 'https://example.go.id/layanan', jenis: 'situs-resmi' },
    sumberTambahan: [],
    verifikasi: 'lengkap',
    tanggalDiperiksa: '2026-11-10',
  },
];

describe('ProgramList', () => {
  it('shows the requested information columns and internal detail links', () => {
    render(<ProgramList programs={programs} />);
    const table = within(screen.getByRole('table'));

    expect(table.getByText('Program Dasar')).toBeTruthy();
    expect(table.getByText('Program Lengkap')).toBeTruthy();
    expect(table.getByRole('columnheader', { name: 'Program & Layanan' })).toBeTruthy();
    expect(table.getByRole('columnheader', { name: 'Kategori' })).toBeTruthy();
    expect(table.getByRole('columnheader', { name: 'Instansi' })).toBeTruthy();
    expect(table.getByRole('columnheader', { name: 'Terakhir diperbarui' })).toBeTruthy();
    expect(table.getByRole('columnheader', { name: 'Aksi' })).toBeTruthy();
    expect(table.queryByRole('columnheader', { name: 'Jenis' })).toBeNull();
    expect(table.queryByRole('columnheader', { name: 'Status verifikasi' })).toBeNull();
    const detailLink = table
      .getAllByRole('link', { name: 'Lihat detail' })
      .find((link) => link.getAttribute('href') === '/admin/informasi/program-lengkap');
    expect(detailLink).toBeTruthy();
    expect(detailLink?.textContent).toBe('Lihat detail');
    expect(table.queryByRole('link', { name: 'Sumber resmi' })).toBeNull();
  });

  it('filters by category', async () => {
    render(<ProgramList programs={programs} />);
    fireEvent.click(screen.getByRole('button', { name: /^Semua kategori/ }));
    fireEvent.click(await screen.findByRole('option', { name: 'Pekerjaan & Pelatihan' }));
    const table = within(screen.getByRole('table'));

    expect(table.getByText('Program Dasar')).toBeTruthy();
    expect(table.queryByText('Program Lengkap')).toBeNull();
    expect(table.queryByText('Layanan Administrasi')).toBeNull();
  });

  it('filters the list by name, organizer, and category', () => {
    render(<ProgramList programs={programs} />);
    fireEvent.change(screen.getByRole('searchbox', { name: 'Cari nama informasi atau instansi' }), {
      target: { value: 'ketenagakerjaan' },
    });
    const table = within(screen.getByRole('table'));

    expect(table.getByText('Program Dasar')).toBeTruthy();
    expect(table.queryByText('Program Lengkap')).toBeNull();
  });

  it('uses different colors for category badges', () => {
    render(<ProgramList programs={programs} />);
    const educationBadge = screen
      .getAllByText('Pendidikan')
      .find((element) => element.classList.contains('rounded-full'));
    const workBadge = screen
      .getAllByText('Pekerjaan & Pelatihan')
      .find((element) => element.classList.contains('rounded-full'));

    expect(educationBadge?.className).not.toBe(workBadge?.className);
  });

  it('renders the search icon as decorative content beside the input', () => {
    render(<ProgramList programs={programs} />);

    expect(screen.getByRole('searchbox').parentElement?.querySelector('svg')).toBeTruthy();
  });
});
