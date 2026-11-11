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
    expect(table.getByRole('columnheader', { name: 'Jenis' })).toBeTruthy();
    expect(table.getByRole('columnheader', { name: 'Instansi' })).toBeTruthy();
    expect(table.getByRole('columnheader', { name: 'Terakhir diperbarui' })).toBeTruthy();
    expect(table.getByRole('columnheader', { name: 'Aksi' })).toBeTruthy();
    expect(table.queryByRole('columnheader', { name: 'Kategori' })).toBeNull();
    expect(table.queryByRole('columnheader', { name: 'Status verifikasi' })).toBeNull();
    const detailLink = table
      .getAllByRole('link', { name: 'Lihat detail' })
      .find((link) => link.getAttribute('href') === '/admin/informasi/program-lengkap');
    expect(detailLink).toBeTruthy();
    expect(detailLink?.textContent).toBe('Lihat detail');
    expect(table.queryByRole('link', { name: 'Sumber resmi' })).toBeNull();
  });

  it('shows each entry as a program or a service', () => {
    render(<ProgramList programs={programs} />);
    const table = within(screen.getByRole('table'));

    expect(table.getAllByText('Program')).toHaveLength(2);
    expect(table.getAllByText('Layanan')).toHaveLength(1);
  });

  it('filters by kind', async () => {
    render(<ProgramList programs={programs} />);
    fireEvent.click(screen.getByRole('button', { name: /^Semua jenis/ }));
    fireEvent.click(await screen.findByRole('option', { name: 'Layanan' }));
    const table = within(screen.getByRole('table'));

    expect(table.getByText('Layanan Administrasi')).toBeTruthy();
    expect(table.queryByText('Program Dasar')).toBeNull();
    expect(table.queryByText('Program Lengkap')).toBeNull();
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

  it('uses different colors for program and service badges', () => {
    render(<ProgramList programs={programs} />);
    const table = within(screen.getByRole('table'));
    const programBadge = table.getAllByText('Program')[0];
    const serviceBadge = table.getByText('Layanan');

    expect(programBadge?.className).not.toBe(serviceBadge.className);
  });

  it('renders the search icon as decorative content beside the input', () => {
    render(<ProgramList programs={programs} />);

    expect(screen.getByRole('searchbox').parentElement?.querySelector('svg')).toBeTruthy();
  });
});

describe('ProgramList pagination', () => {
  const manyPrograms: Program[] = Array.from({ length: 23 }, (_, index) => ({
    ...programs[0]!,
    id: `program-${index + 1}`,
    nama: `Informasi ${String(index + 1).padStart(2, '0')}`,
  }));

  it('shows ten entries per page and moves between pages', () => {
    render(<ProgramList programs={manyPrograms} />);

    expect(
      within(screen.getByRole('table')).getAllByRole('link', { name: 'Lihat detail' }),
    ).toHaveLength(10);
    expect(screen.getByText('Informasi 01')).toBeTruthy();
    expect(screen.queryByText('Informasi 11')).toBeNull();

    fireEvent.click(screen.getByRole('button', { name: 'Halaman 3' }));

    expect(
      within(screen.getByRole('table')).getAllByRole('link', { name: 'Lihat detail' }),
    ).toHaveLength(3);
    expect(screen.getByText('Informasi 23')).toBeTruthy();
  });

  it('goes back to the first page when the search changes', () => {
    render(<ProgramList programs={manyPrograms} />);
    fireEvent.click(screen.getByRole('button', { name: 'Halaman 2' }));
    fireEvent.change(screen.getByRole('searchbox'), { target: { value: 'Informasi 0' } });

    expect(screen.getByText('Informasi 01')).toBeTruthy();
    expect(screen.queryByRole('navigation', { name: 'Halaman daftar informasi' })).toBeNull();
  });

  it('hides the pager when everything fits on one page', () => {
    render(<ProgramList programs={programs} />);

    expect(screen.queryByRole('navigation', { name: 'Halaman daftar informasi' })).toBeNull();
  });
});
