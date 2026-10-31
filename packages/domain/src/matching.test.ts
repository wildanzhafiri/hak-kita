import { describe, expect, it } from 'vitest';
import type { Profile } from '@hakkita/schema';
import { matchProgram, matchPrograms } from './matching';
import { makeProgram, TODAY, WILAYAH_LIST } from './test-helpers';
import { buildWilayahIndex } from './wilayah';

const index = buildWilayahIndex(WILAYAH_LIST);
const profile: Profile = {
  kelompok: 'calon-mahasiswa',
  rentangUsia: '18-24',
  wilayah: '31',
  tahunLulus: 2026,
};
const program = makeProgram({
  id: 'kuliah',
  syarat: [{ teks: 'Lulusan tahun 2024, 2025, atau 2026', sumberUrl: 'https://contoh.go.id' }],
  kriteria: [{ kelompok: ['calon-mahasiswa'], tahunLulus: [2024, 2025, 2026], syaratIndex: 0 }],
  tipeGerbang: 'desil',
  periode: { buka: '2026-02-03', tutup: '2026-10-31' },
});

describe('matchProgram', () => {
  it('returns a sourced reason for a matching profile', () => {
    const result = matchProgram(program, { profile, today: TODAY, wilayahIndex: index });
    expect(result.status).toBe('berpotensi-sesuai');
    expect(result.reasons).toEqual(program.syarat);
    expect(result.checks).toEqual([]);
  });

  it('keeps the official desil check visible', () => {
    const result = matchProgram(program, { profile, today: TODAY, wilayahIndex: index });
    expect(result.officialCheck).toContain('desil');
  });

  it('does not claim a match for another group', () => {
    const result = matchProgram(program, {
      profile: { ...profile, kelompok: 'pekerja' },
      today: TODAY,
      wilayahIndex: index,
    });
    expect(result.status).toBe('perlu-dicek');
    expect(result.checks).toContain('Kelompok yang kamu pilih belum cocok dengan syarat ini.');
  });

  it('flags a graduation year outside the sourced criterion', () => {
    const result = matchProgram(program, {
      profile: { ...profile, tahunLulus: 2023 },
      today: TODAY,
      wilayahIndex: index,
    });
    expect(result.status).toBe('perlu-dicek');
    expect(result.checks).toContain('Tahun lulus yang kamu pilih belum cocok dengan syarat ini.');
  });

  it('flags a region outside the program scope', () => {
    const regional = makeProgram({
      ...program,
      cakupan: { level: 'provinsi', kode: '31' },
    });
    const result = matchProgram(regional, {
      profile: { ...profile, wilayah: '32' },
      today: TODAY,
      wilayahIndex: index,
    });
    expect(result.status).toBe('perlu-dicek');
    expect(result.checks).toContain('Wilayah yang kamu pilih berada di luar cakupan program ini.');
  });

  it('flags a closed registration period', () => {
    const result = matchProgram(program, {
      profile,
      today: '2026-11-01',
      wilayahIndex: index,
    });
    expect(result.status).toBe('perlu-dicek');
    expect(result.checks).toContain('Periode yang tercatat sudah ditutup. Periksa jadwal terbaru.');
  });

  it('does not match an unverified program', () => {
    const result = matchProgram(makeProgram({ ...program, verifikasi: 'belum' }), {
      profile,
      today: TODAY,
      wilayahIndex: index,
    });
    expect(result.status).toBe('perlu-dicek');
    expect(result.checks).toContain('Rincian syarat program ini belum kami verifikasi.');
  });

  it('does not match a program without structured criteria', () => {
    const result = matchProgram(makeProgram(), { profile, today: TODAY, wilayahIndex: index });
    expect(result.status).toBe('perlu-dicek');
    expect(result.checks).toContain('Kriteria pencocokan program ini belum tersedia.');
  });

  it('keeps an overlapping age band as uncertain', () => {
    const ageProgram = makeProgram({
      ...program,
      kriteria: [{ kelompok: ['calon-mahasiswa'], usiaMaksimum: 64, syaratIndex: 0 }],
    });
    const result = matchProgram(ageProgram, {
      profile: { ...profile, rentangUsia: '60-ke-atas' },
      today: TODAY,
      wilayahIndex: index,
    });
    expect(result.status).toBe('perlu-dicek');
    expect(result.checks).toContain('Rentang usiamu perlu dicocokkan lagi dengan syarat ini.');
  });
});

describe('matchPrograms', () => {
  it('puts sourced potential matches before other programs', () => {
    const results = matchPrograms([makeProgram({ id: 'lain' }), program], {
      profile,
      today: TODAY,
      wilayahIndex: index,
    });
    expect(results.map((result) => result.program.id)).toEqual(['kuliah', 'lain']);
  });
});
