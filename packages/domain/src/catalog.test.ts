import { describe, expect, it } from 'vitest';
import { filterPrograms, listKategori } from './catalog';
import { WILAYAH_LIST, makeProgram } from './test-helpers';
import type { ProgramFilter } from './types';
import { buildWilayahIndex } from './wilayah';

const index = buildWilayahIndex(WILAYAH_LIST);

const programs = [
  makeProgram({ id: 'beasiswa-a', nama: 'Beasiswa Alfa', kategori: 'Beasiswa' }),
  makeProgram({
    id: 'sehat-b',
    nama: 'Sehat Bersama',
    kategori: 'Kesehatan',
    penyelenggara: 'Kementerian Kesehatan',
  }),
  makeProgram({
    id: 'garut-c',
    nama: 'Bantuan Garut',
    kategori: 'Bantuan Sosial',
    cakupan: { level: 'kabkota', kode: '3205' },
  }),
  makeProgram({
    id: 'jakarta-d',
    nama: 'Kartu Jakarta',
    kategori: 'Bantuan Sosial',
    cakupan: { level: 'provinsi', kode: '31' },
    syarat: [{ teks: 'Terdaftar sebagai penduduk DKI' }],
  }),
];

function filterWith(overrides: Partial<ProgramFilter> = {}): string[] {
  const filter: ProgramFilter = { query: '', kategori: null, wilayah: null, ...overrides };
  return filterPrograms(programs, filter, index).map((p) => p.id);
}

describe('filterPrograms', () => {
  it('returns everything sorted by name when no filter is set', () => {
    expect(filterWith()).toEqual(['garut-c', 'beasiswa-a', 'jakarta-d', 'sehat-b']);
  });

  it('matches the query case-insensitively across name, agency, and requirements', () => {
    expect(filterWith({ query: 'ALFA' })).toEqual(['beasiswa-a']);
    expect(filterWith({ query: 'kementerian kesehatan' })).toEqual(['sehat-b']);
    expect(filterWith({ query: 'penduduk dki' })).toEqual(['jakarta-d']);
  });

  it('ignores surrounding whitespace in the query', () => {
    expect(filterWith({ query: '  alfa  ' })).toEqual(['beasiswa-a']);
  });

  it('filters by category', () => {
    expect(filterWith({ kategori: 'Bantuan Sosial' })).toEqual(['garut-c', 'jakarta-d']);
  });

  it('keeps national programs and those covering the selected region', () => {
    expect(filterWith({ wilayah: '3205' })).toEqual(['garut-c', 'beasiswa-a', 'sehat-b']);
    expect(filterWith({ wilayah: '31' })).toEqual(['beasiswa-a', 'jakarta-d', 'sehat-b']);
  });

  it('combines all filters', () => {
    expect(filterWith({ wilayah: '3205', kategori: 'Bantuan Sosial', query: 'garut' })).toEqual([
      'garut-c',
    ]);
  });

  it('returns nothing when no program matches', () => {
    expect(filterWith({ query: 'tidak ada' })).toEqual([]);
  });

  it('does not reorder the input array', () => {
    const before = programs.map((p) => p.id);
    filterWith({ query: 'a' });
    expect(programs.map((p) => p.id)).toEqual(before);
  });
});

describe('listKategori', () => {
  it('returns each category once, sorted', () => {
    expect(listKategori(programs)).toEqual(['Bantuan Sosial', 'Beasiswa', 'Kesehatan']);
  });
});
