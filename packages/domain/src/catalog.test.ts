import { describe, expect, it } from 'vitest';
import { filterPrograms, listKategori, rankPrograms } from './catalog';
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

  it('matches the query against service aliases', () => {
    const service = makeProgram({
      id: 'kk-e',
      nama: 'Pengurusan Kartu Keluarga',
      jenis: 'layanan',
      kategori: 'Kependudukan & Dokumen Pribadi',
      alias: ['pecah kk'],
    });
    const filter: ProgramFilter = { query: 'pecah kk', kategori: null, wilayah: null };
    expect(filterPrograms([...programs, service], filter, index).map((p) => p.id)).toEqual([
      'kk-e',
    ]);
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

describe('rankPrograms', () => {
  const sim = makeProgram({
    id: 'sim-baru',
    nama: 'Pendaftaran SIM Baru',
    jenis: 'layanan',
    kategori: 'Kendaraan & Transportasi',
    alias: ['bikin sim'],
  });
  const renewal = makeProgram({
    id: 'perpanjangan-sim',
    nama: 'Perpanjangan SIM',
    jenis: 'layanan',
    kategori: 'Kendaraan & Transportasi',
  });
  const death = makeProgram({
    id: 'akta-kematian',
    nama: 'Pembuatan Akta Kematian',
    jenis: 'layanan',
    kategori: 'Kependudukan & Dokumen Pribadi',
    ringkasan: 'Persyaratan akta kematian baru atau pengganti menurut layanan Dukcapil.',
  });
  const building = makeProgram({
    id: 'pbg-slf',
    nama: 'Pengajuan PBG dan SLF melalui SIMBG',
    jenis: 'layanan',
    kategori: 'Pertanahan & Bangunan',
  });
  const services = [death, building, renewal, sim];

  it('keeps the services that match the words people use and drops filler matches', () => {
    expect(rankPrograms(services, 'bikin SIM baru atau perpanjangan', 5).map((p) => p.id)).toEqual([
      'sim-baru',
      'perpanjangan-sim',
    ]);
  });

  it('matches whole words, so a short term does not hit longer words', () => {
    expect(rankPrograms(services, 'sim', 5).map((p) => p.id)).toEqual([
      'sim-baru',
      'perpanjangan-sim',
    ]);
  });

  it('returns nothing when the query only has filler words', () => {
    expect(rankPrograms(services, 'apa yang bisa', 5)).toEqual([]);
  });

  it('respects the result limit', () => {
    expect(rankPrograms(services, 'sim', 1)).toHaveLength(1);
  });
});
