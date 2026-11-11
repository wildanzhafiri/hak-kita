import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { WILAYAH, makeProgram } from '@/test/fixtures';
import { ProgramList } from './program-list';

const programs = [
  makeProgram({ id: 'beasiswa-a', nama: 'Beasiswa Alfa', kategori: 'Beasiswa' }),
  makeProgram({ id: 'sehat-b', nama: 'Sehat Bersama', kategori: 'Kesehatan' }),
  makeProgram({
    id: 'jakarta-c',
    nama: 'Kartu Jakarta',
    kategori: 'Bantuan Sosial',
    cakupan: { level: 'provinsi', kode: '31' },
  }),
];

function renderList(initialQuery?: string) {
  return render(
    <ProgramList
      programs={programs}
      wilayah={WILAYAH}
      initialQuery={initialQuery}
      today="2026-11-10"
    />,
  );
}

function programNames(): string[] {
  return screen.queryAllByRole('heading', { level: 3 }).map((h) => h.textContent ?? '');
}

describe('ProgramList', () => {
  it('lists every program sorted by name', () => {
    renderList();
    expect(programNames()).toEqual(['Beasiswa Alfa', 'Kartu Jakarta', 'Sehat Bersama']);
  });

  it('starts from the initial query', () => {
    renderList('sehat');
    expect(programNames()).toEqual(['Sehat Bersama']);
  });

  it('applies the search only after submitting the form', () => {
    renderList();
    fireEvent.change(screen.getByLabelText('Cari'), { target: { value: 'alfa' } });
    expect(programNames()).toEqual(['Beasiswa Alfa', 'Kartu Jakarta', 'Sehat Bersama']);
    fireEvent.click(screen.getByRole('button', { name: 'Cari' }));
    expect(programNames()).toEqual(['Beasiswa Alfa']);
  });

  it('keeps the applied results until a new query is submitted', () => {
    renderList('sehat');
    fireEvent.change(screen.getByLabelText('Cari'), { target: { value: 'alfa' } });
    expect(programNames()).toEqual(['Sehat Bersama']);
    fireEvent.submit(screen.getByLabelText('Cari').closest('form')!);
    expect(programNames()).toEqual(['Beasiswa Alfa']);
  });

  it('filters by category', () => {
    renderList();
    fireEvent.click(screen.getByLabelText('Kategori'));
    fireEvent.click(screen.getByRole('option', { name: 'Kesehatan' }));
    expect(programNames()).toEqual(['Sehat Bersama']);
  });

  it('keeps national programs and the selected province programs', () => {
    renderList();
    fireEvent.click(screen.getByRole('button', { name: 'Semua wilayah' }));
    fireEvent.click(screen.getByLabelText('Provinsi'));
    fireEvent.click(screen.getByRole('option', { name: 'Jawa Barat' }));
    fireEvent.click(screen.getByRole('button', { name: 'Selesai' }));
    expect(programNames()).toEqual(['Beasiswa Alfa', 'Sehat Bersama']);
  });

  it('enables the regency select only after a province is chosen', () => {
    renderList();
    fireEvent.click(screen.getByRole('button', { name: 'Semua wilayah' }));
    const regency = screen.getByLabelText('Kabupaten atau kota') as HTMLButtonElement;
    expect(regency.disabled).toBe(true);
    fireEvent.click(screen.getByLabelText('Provinsi'));
    fireEvent.click(screen.getByRole('option', { name: 'Jawa Barat' }));
    expect(regency.disabled).toBe(false);
  });

  it('shows removable chips for active filters and clears them all', () => {
    renderList();
    fireEvent.click(screen.getByLabelText('Kategori'));
    fireEvent.click(screen.getByRole('option', { name: 'Kesehatan' }));
    expect(screen.getByRole('button', { name: 'Hapus filter Kesehatan' })).toBeTruthy();
    expect(screen.getByText('1 program ditemukan')).toBeTruthy();
    fireEvent.click(screen.getByRole('button', { name: 'Hapus semua' }));
    expect(screen.queryByRole('button', { name: 'Hapus filter Kesehatan' })).toBeNull();
    expect(programNames()).toHaveLength(3);
  });

  it('shows an empty state and restores the list on reset', () => {
    renderList('tidak ada');
    expect(screen.getByText('Belum ada hasil yang sesuai.')).toBeTruthy();
    fireEvent.click(screen.getByRole('button', { name: 'Atur ulang filter' }));
    expect(programNames()).toHaveLength(3);
  });

  it('shows the redesigned service categories and guides without duplicate sections', () => {
    render(
      <ProgramList
        programs={[
          makeProgram({
            id: 'ktp-el',
            jenis: 'layanan',
            kategori: 'Kependudukan & Dokumen Pribadi',
            nama: 'KTP Elektronik',
          }),
          makeProgram({
            id: 'npwp',
            jenis: 'layanan',
            kategori: 'Perpajakan',
            nama: 'Nomor Pokok Wajib Pajak',
          }),
        ]}
        wilayah={WILAYAH}
        servicePage
      />,
    );

    expect(screen.getByRole('heading', { name: 'Jelajahi berdasarkan kategori' })).toBeTruthy();
    expect(screen.getByRole('heading', { name: 'Semua layanan' })).toBeTruthy();
    expect(screen.getByRole('button', { name: 'Kependudukan & Dokumen Pribadi' })).toBeTruthy();
    expect(screen.getByRole('button', { name: 'Perpajakan' })).toBeTruthy();
    expect(screen.queryByRole('heading', { name: 'Mulai Dari Layanan Ini' })).toBeNull();
    expect(
      screen
        .getAllByRole('link', { name: 'KTP Elektronik' })
        .some((link) => link.getAttribute('href') === '/layanan/ktp-el'),
    ).toBe(true);
    expect(screen.getByText('Menampilkan 1–2 dari 2 layanan')).toBeTruthy();
    expect(screen.queryByRole('navigation', { name: 'Halaman layanan' })).toBeNull();
  });

  it('paginates service results in groups of twelve', () => {
    const servicePrograms = Array.from({ length: 13 }, (_, index) =>
      makeProgram({
        id: `layanan-${index + 1}`,
        jenis: 'layanan',
        kategori: 'Kependudukan & Dokumen Pribadi',
        nama: `Layanan ${String(index + 1).padStart(2, '0')}`,
      }),
    );

    render(<ProgramList programs={servicePrograms} wilayah={WILAYAH} servicePage />);

    expect(screen.getByText('Menampilkan 1–12 dari 13 layanan')).toBeTruthy();
    expect(screen.getByRole('heading', { name: 'Layanan 12' })).toBeTruthy();
    expect(screen.queryByRole('heading', { name: 'Layanan 13' })).toBeNull();
    fireEvent.click(screen.getByRole('button', { name: 'Halaman 2' }));
    expect(screen.getByText('Menampilkan 13–13 dari 13 layanan')).toBeTruthy();
    expect(screen.getByRole('heading', { name: 'Layanan 13' })).toBeTruthy();
    expect(screen.queryByRole('heading', { name: 'Layanan 01' })).toBeNull();
  });

  it('paginates program results and returns to the first page when filters change', () => {
    const programResults = [
      ...Array.from({ length: 13 }, (_, index) =>
        makeProgram({
          id: `program-${index + 1}`,
          kategori: 'Beasiswa',
          nama: `Program ${String(index + 1).padStart(2, '0')}`,
        }),
      ),
      makeProgram({ id: 'sehat', kategori: 'Kesehatan', nama: 'Sehat Bersama' }),
    ];

    render(<ProgramList programs={programResults} wilayah={WILAYAH} />);

    expect(screen.getByRole('navigation', { name: 'Halaman program' })).toBeTruthy();
    expect(screen.getByRole('heading', { name: 'Program 12' })).toBeTruthy();
    expect(screen.queryByRole('heading', { name: 'Program 13' })).toBeNull();

    fireEvent.click(screen.getByRole('button', { name: 'Halaman 2' }));
    expect(screen.getByRole('heading', { name: 'Program 13' })).toBeTruthy();
    expect(screen.queryByRole('heading', { name: 'Program 01' })).toBeNull();

    fireEvent.click(screen.getByLabelText('Kategori'));
    fireEvent.click(screen.getByRole('option', { name: 'Kesehatan' }));
    expect(programNames()).toEqual(['Sehat Bersama']);
    expect(screen.queryByRole('navigation', { name: 'Halaman program' })).toBeNull();
  });
});
