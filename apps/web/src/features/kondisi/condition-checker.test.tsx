import { afterEach, describe, expect, it } from 'vitest';
import { fireEvent, render, screen } from '@testing-library/react';
import { BUILT_ON, makeProgram, WILAYAH } from '@/test/fixtures';
import { ConditionChecker } from './condition-checker';

const program = makeProgram({
  id: 'kip-kuliah',
  nama: 'KIP Kuliah',
  tipeGerbang: 'desil',
  syarat: [
    {
      teks: 'Lulusan SMA tahun 2024, 2025, atau 2026',
      sumberUrl: 'https://contoh.go.id/panduan',
    },
  ],
  kriteria: [{ kelompok: ['calon-mahasiswa'], tahunLulus: [2024, 2025, 2026], syaratIndex: 0 }],
  periode: { buka: '2026-02-03', tutup: '2026-10-31' },
});

afterEach(() => {
  window.localStorage.clear();
});

describe('ConditionChecker', () => {
  it('shows question progress and a sourced potential result', () => {
    render(<ConditionChecker programs={[program]} wilayah={WILAYAH} builtOn={BUILT_ON} />);
    expect(
      screen.getByRole('progressbar', { name: 'Progres pertanyaan' }).getAttribute('aria-valuenow'),
    ).toBe('0');
    fireEvent.click(screen.getByRole('radio', { name: 'Calon mahasiswa' }));
    fireEvent.click(screen.getByRole('button', { name: /Lanjut/ }));
    expect(screen.getByText('Pertanyaan 2 dari 4')).toBeTruthy();
    fireEvent.click(screen.getByRole('radio', { name: '18–24 tahun' }));
    fireEvent.click(screen.getByRole('button', { name: /Lanjut/ }));
    fireEvent.click(screen.getByRole('radio', { name: 'DKI Jakarta' }));
    fireEvent.click(screen.getByRole('button', { name: /Lanjut/ }));
    fireEvent.click(screen.getByRole('radio', { name: '2026' }));
    fireEvent.click(screen.getByRole('button', { name: /Lihat hasil/ }));
    expect(screen.getByText('Berpotensi sesuai')).toBeTruthy();
    expect(screen.getByText('Lulusan SMA tahun 2024, 2025, atau 2026')).toBeTruthy();
    expect(screen.getByRole('link', { name: 'Lihat sumber' }).getAttribute('href')).toBe(
      'https://contoh.go.id/panduan',
    );
    expect(screen.getByText(/tidak menghitung desil/)).toBeTruthy();
  });

  it('keeps an answer after the checker is remounted', () => {
    const first = render(
      <ConditionChecker programs={[program]} wilayah={WILAYAH} builtOn={BUILT_ON} />,
    );
    fireEvent.click(screen.getByRole('radio', { name: 'Calon mahasiswa' }));
    first.unmount();
    render(<ConditionChecker programs={[program]} wilayah={WILAYAH} builtOn={BUILT_ON} />);
    expect(
      screen.getByRole('radio', { name: 'Calon mahasiswa' }).getAttribute('checked'),
    ).not.toBeNull();
  });

  it('skips the graduation question for another group', () => {
    render(<ConditionChecker programs={[program]} wilayah={WILAYAH} builtOn={BUILT_ON} />);
    fireEvent.click(screen.getByRole('radio', { name: 'Pekerja' }));
    expect(screen.getByText('Pertanyaan 1 dari 3')).toBeTruthy();
  });
});
