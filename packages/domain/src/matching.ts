import type { Program } from '@hakkita/schema';
import { AGE_BAND_LIMITS } from './constants';
import { periodStatus } from './period';
import type { MatchOptions, MatchResult } from './types';
import { appliesIn } from './wilayah';

function officialCheck(program: Program): string {
  if (program.tipeGerbang === 'desil') {
    return 'Periksa desil dan keputusan akhir melalui kanal resmi. HAKKITA tidak menghitung desil.';
  }
  return 'Periksa seluruh syarat dan keputusan akhir melalui kanal resmi penyelenggara.';
}

export function matchProgram(program: Program, options: MatchOptions): MatchResult {
  const base = { program, officialCheck: officialCheck(program) };
  if (program.verifikasi === 'belum') {
    return {
      ...base,
      status: 'perlu-dicek',
      reasons: [],
      checks: ['Rincian syarat program ini belum kami verifikasi.'],
    };
  }
  if (!program.kriteria) {
    return {
      ...base,
      status: 'perlu-dicek',
      reasons: [],
      checks: ['Kriteria pencocokan program ini belum tersedia.'],
    };
  }

  const checks: string[] = [];
  const { profile, today, wilayahIndex } = options;
  const period = periodStatus(program.periode, today);
  if (period === 'ditutup')
    checks.push('Periode yang tercatat sudah ditutup. Periksa jadwal terbaru.');
  if (period === 'belum-dibuka') checks.push('Periode yang tercatat belum dibuka.');

  if (program.cakupan.level !== 'nasional') {
    if (!profile.wilayah || profile.wilayah === 'lain') {
      checks.push('Cakupan wilayah program ini perlu kamu periksa.');
    } else if (!appliesIn(program.cakupan.kode, profile.wilayah, wilayahIndex)) {
      checks.push('Wilayah yang kamu pilih berada di luar cakupan program ini.');
    }
  }

  for (const kriteria of program.kriteria) {
    if (!profile.kelompok || !kriteria.kelompok.includes(profile.kelompok)) {
      checks.push('Kelompok yang kamu pilih belum cocok dengan syarat ini.');
      continue;
    }
    if (kriteria.tahunLulus) {
      if (typeof profile.tahunLulus !== 'number') {
        checks.push('Tahun lulusmu perlu dicocokkan lagi dengan syarat ini.');
      } else if (!kriteria.tahunLulus.includes(profile.tahunLulus)) {
        checks.push('Tahun lulus yang kamu pilih belum cocok dengan syarat ini.');
      }
    }
    if (kriteria.usiaMinimum !== undefined || kriteria.usiaMaksimum !== undefined) {
      const band = profile.rentangUsia ? AGE_BAND_LIMITS[profile.rentangUsia] : null;
      if (
        !band ||
        (kriteria.usiaMinimum !== undefined && band.minimum < kriteria.usiaMinimum) ||
        (kriteria.usiaMaksimum !== undefined &&
          (band.maximum === null || band.maximum > kriteria.usiaMaksimum))
      ) {
        checks.push('Rentang usiamu perlu dicocokkan lagi dengan syarat ini.');
      }
    }
  }

  return {
    ...base,
    status: checks.length === 0 ? 'berpotensi-sesuai' : 'perlu-dicek',
    reasons: program.kriteria
      .map((kriteria) => program.syarat[kriteria.syaratIndex])
      .filter((s) => s !== undefined),
    checks,
  };
}

export function matchPrograms(programs: readonly Program[], options: MatchOptions): MatchResult[] {
  return programs
    .map((program) => matchProgram(program, options))
    .sort(
      (a, b) =>
        Number(b.status === 'berpotensi-sesuai') - Number(a.status === 'berpotensi-sesuai') ||
        a.program.nama.localeCompare(b.program.nama, 'id'),
    );
}
