import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { BUILT_ON, WILAYAH, makeProgram } from '@/test/fixtures';
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
      builtOn={BUILT_ON}
      initialQuery={initialQuery}
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

  it('filters while the visitor types', () => {
    renderList();
    fireEvent.change(screen.getByLabelText('Cari'), { target: { value: 'alfa' } });
    expect(programNames()).toEqual(['Beasiswa Alfa']);
  });

  it('filters by category', () => {
    renderList();
    fireEvent.change(screen.getByLabelText('Kategori'), { target: { value: 'Kesehatan' } });
    expect(programNames()).toEqual(['Sehat Bersama']);
  });

  it('keeps national programs and the selected province programs', () => {
    renderList();
    fireEvent.change(screen.getByLabelText('Provinsi'), { target: { value: '32' } });
    expect(programNames()).toEqual(['Beasiswa Alfa', 'Sehat Bersama']);
  });

  it('enables the regency select only after a province is chosen', () => {
    renderList();
    const regency = screen.getByLabelText('Kabupaten atau kota') as HTMLSelectElement;
    expect(regency.disabled).toBe(true);
    fireEvent.change(screen.getByLabelText('Provinsi'), { target: { value: '32' } });
    expect(regency.disabled).toBe(false);
  });

  it('shows an empty state and restores the list on reset', () => {
    renderList('tidak ada');
    expect(screen.getByText('Belum ada hasil yang sesuai.')).toBeTruthy();
    fireEvent.click(screen.getByRole('button', { name: 'Atur ulang filter' }));
    expect(programNames()).toHaveLength(3);
  });
});
