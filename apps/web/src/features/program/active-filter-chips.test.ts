import { describe, expect, it, vi } from 'vitest';
import { WILAYAH } from '@/test/fixtures';
import { readActiveFilterChips } from './active-filter-chips';
import type { ProgramFilters } from './types';

function makeFilters(overrides: Partial<ProgramFilters> = {}): ProgramFilters {
  return {
    query: '',
    draftQuery: '',
    kategori: null,
    provinsi: null,
    kabkota: null,
    sasaran: [],
    manfaat: [],
    jenjang: null,
    periodeStatus: null,
    urutan: 'nama',
    kategoriOptions: [],
    provinsiOptions: WILAYAH.filter((wilayah) => wilayah.level === 'provinsi'),
    kabkotaOptions: WILAYAH.filter((wilayah) => wilayah.level === 'kabkota'),
    sasaranOptions: [],
    manfaatOptions: [],
    jenjangOptions: [],
    results: [],
    setDraftQuery: vi.fn(),
    submitQuery: vi.fn(),
    selectKategori: vi.fn(),
    selectProvinsi: vi.fn(),
    selectKabkota: vi.fn(),
    toggleSasaran: vi.fn(),
    toggleManfaat: vi.fn(),
    selectJenjang: vi.fn(),
    clearMoreFilters: vi.fn(),
    selectPeriodeStatus: vi.fn(),
    selectUrutan: vi.fn(),
    clearSasaran: vi.fn(),
    clearQuery: vi.fn(),
    clearFilters: vi.fn(),
    reset: vi.fn(),
    ...overrides,
  };
}

describe('readActiveFilterChips', () => {
  it('returns nothing when no filter is active', () => {
    expect(readActiveFilterChips(makeFilters())).toEqual([]);
  });

  it('names every active filter in a readable label', () => {
    const chips = readActiveFilterChips(
      makeFilters({
        query: 'beasiswa',
        kategori: 'Pendidikan',
        provinsi: '32',
        kabkota: '3205',
        sasaran: ['Keluarga'],
        manfaat: ['Subsidi'],
        jenjang: 'S1',
        periodeStatus: 'dibuka',
      }),
    );
    expect(chips.map((chip) => chip.label)).toEqual([
      'Pencarian: beasiswa',
      'Pendidikan',
      'Kabupaten Garut, Jawa Barat',
      'Keluarga',
      'Subsidi',
      'S1',
      'Sedang dibuka',
    ]);
  });

  it('removes only the chosen filter', () => {
    const filters = makeFilters({ provinsi: '32', sasaran: ['Keluarga'] });
    const chips = readActiveFilterChips(filters);
    chips[1]?.remove();
    expect(filters.toggleSasaran).toHaveBeenCalledWith('Keluarga');
    chips[0]?.remove();
    expect(filters.selectProvinsi).toHaveBeenCalledWith('');
  });
});
