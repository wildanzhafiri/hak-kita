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
  return render(<ProgramList programs={programs} wilayah={WILAYAH} initialQuery={initialQuery} />);
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

  it('filters while the visitor types', () => {
    renderList();
    fireEvent.change(screen.getByLabelText('Cari'), { target: { value: 'alfa' } });
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
    fireEvent.click(screen.getByLabelText('Provinsi'));
    fireEvent.click(screen.getByRole('option', { name: 'Jawa Barat' }));
    expect(programNames()).toEqual(['Beasiswa Alfa', 'Sehat Bersama']);
  });

  it('enables the regency select only after a province is chosen', () => {
    renderList();
    const regency = screen.getByLabelText('Kabupaten atau kota') as HTMLButtonElement;
    expect(regency.disabled).toBe(true);
    fireEvent.click(screen.getByLabelText('Provinsi'));
    fireEvent.click(screen.getByRole('option', { name: 'Jawa Barat' }));
    expect(regency.disabled).toBe(false);
  });

  it('shows an empty state and restores the list on reset', () => {
    renderList('tidak ada');
    expect(screen.getByText('Belum ada hasil yang sesuai.')).toBeTruthy();
    fireEvent.click(screen.getByRole('button', { name: 'Atur ulang filter' }));
    expect(programNames()).toHaveLength(3);
  });

  it('uses the service catalog sections and links service guides', () => {
    render(
      <ProgramList
        programs={[makeProgram({ id: 'ktp-el', nama: 'KTP Elektronik', kategori: 'Layanan Administrasi' })]}
        wilayah={WILAYAH}
        servicePage
      />,
    );

    expect(screen.getByRole('heading', { name: 'Mulai dari Layanan Ini' })).toBeTruthy();
    expect(screen.getByRole('heading', { name: 'Jelajahi berdasarkan kategori' })).toBeTruthy();
    expect(
      screen
        .getAllByRole('link', { name: 'KTP Elektronik' })
        .some((link) => link.getAttribute('href') === '/layanan/ktp-el'),
    ).toBe(true);
    expect(screen.getByText('1 layanan')).toBeTruthy();
  });
});
