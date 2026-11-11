import { act, renderHook } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { KATEGORI_PROGRAM } from '@hakkita/schema';
import { WILAYAH, makeProgram } from '@/test/fixtures';
import { useProgramFilters } from './use-program-filters';

const programs = [
  makeProgram({
    id: 'dibuka',
    nama: 'Program Dibuka',
    untuk: ['Mahasiswa', 'Keluarga berpenghasilan rendah'],
    periode: { buka: '2026-11-01', tutup: '2026-11-30' },
    tanggalDiperiksa: '2026-11-02',
    manfaat: ['Bantuan Biaya Pendidikan'],
    jenjang: ['S1', 'S2'],
  }),
  makeProgram({
    id: 'ditutup',
    nama: 'Program Ditutup',
    untuk: ['Mahasiswa'],
    periode: { buka: '2026-09-01', tutup: '2026-09-30' },
    tanggalDiperiksa: '2026-11-03',
  }),
];

describe('useProgramFilters', () => {
  it('filters program by audience and registration period', () => {
    const { result } = renderHook(() =>
      useProgramFilters({ programs, wilayah: WILAYAH, initialQuery: '', today: '2026-11-10' }),
    );

    act(() => {
      result.current.toggleSasaran('Keluarga');
      result.current.selectPeriodeStatus('dibuka');
    });

    expect(result.current.results.map((program) => program.id)).toEqual(['dibuka']);
  });

  it('offers the shared audience list even when no program uses a group', () => {
    const { result } = renderHook(() =>
      useProgramFilters({ programs, wilayah: WILAYAH, initialQuery: '', today: '2026-11-10' }),
    );

    expect(result.current.sasaranOptions).toEqual([
      'Pelajar',
      'Mahasiswa',
      'Lulusan Baru',
      'Pencari Kerja',
      'Pekerja',
      'Keluarga',
      'Pelaku UMKM',
      'Petani',
      'Lansia',
      'Penyandang Disabilitas',
      'Masyarakat Umum',
    ]);
  });

  it('sorts by most recently checked first and resets added filters', () => {
    const { result } = renderHook(() =>
      useProgramFilters({ programs, wilayah: WILAYAH, initialQuery: '', today: '2026-11-10' }),
    );

    act(() => result.current.selectUrutan('terbaru'));
    expect(result.current.results.map((program) => program.id)).toEqual(['ditutup', 'dibuka']);

    act(() => result.current.reset());
    expect(result.current.urutan).toBe('nama');
    expect(result.current.sasaran).toEqual([]);
    expect(result.current.periodeStatus).toBeNull();
  });

  it('keeps every category and option available even when no program uses it', () => {
    const { result } = renderHook(() =>
      useProgramFilters({ programs, wilayah: WILAYAH, initialQuery: '', today: '2026-11-10' }),
    );

    expect(result.current.kategoriOptions).toHaveLength(KATEGORI_PROGRAM.length);
    expect(result.current.manfaatOptions).toContain('Subsidi');
    expect(result.current.jenjangOptions).toContain('S3');
  });

  it('starts with the requested category selected and filters its programs', () => {
    const { result } = renderHook(() =>
      useProgramFilters({
        programs: [
          ...programs,
          makeProgram({ id: 'health', kategori: 'Kesehatan', nama: 'Program Kesehatan' }),
        ],
        wilayah: WILAYAH,
        initialQuery: '',
        initialCategory: 'Pendidikan',
        today: '2026-11-10',
      }),
    );

    expect(result.current.kategori).toBe('Pendidikan');
    expect(result.current.results.map((program) => program.id)).toEqual(['dibuka', 'ditutup']);
  });

  it('ignores an unknown initial category', () => {
    const { result } = renderHook(() =>
      useProgramFilters({
        programs,
        wilayah: WILAYAH,
        initialQuery: '',
        initialCategory: 'Kategori tidak dikenal',
      }),
    );

    expect(result.current.kategori).toBeNull();
    expect(result.current.results).toHaveLength(programs.length);
  });

  it('filters by benefit type and education level', () => {
    const { result } = renderHook(() =>
      useProgramFilters({ programs, wilayah: WILAYAH, initialQuery: '', today: '2026-11-10' }),
    );

    act(() => result.current.toggleManfaat('Bantuan Biaya Pendidikan'));
    expect(result.current.results.map((program) => program.id)).toEqual(['dibuka']);

    act(() => result.current.selectJenjang('S3'));
    expect(result.current.results).toEqual([]);

    act(() => result.current.clearMoreFilters());
    expect(result.current.results).toHaveLength(2);
  });
});
