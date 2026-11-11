import type { PreferensiProfil, Program, ProfileGroup } from '@hakkita/schema';
import {
  ACTIVITY_GROUPS,
  EDUCATION_LEVELS,
  RECOMMENDATION_CLOSED_PENALTY,
  RECOMMENDATION_GROUP_WEIGHT,
  RECOMMENDATION_INTEREST_WEIGHT,
  RECOMMENDATION_LEVEL_WEIGHT,
  RECOMMENDATION_LOCAL_WEIGHT,
  SCHOOL_LEAVER_EDUCATION,
} from './constants';
import { periodStatus } from './period';
import type {
  ProfileCompleteness,
  Recommendation,
  RecommendationOptions,
  WilayahIndex,
} from './types';
import { appliesIn, wilayahName } from './wilayah';

export const EMPTY_PREFERENCES: PreferensiProfil = {
  provinsi: null,
  kota: null,
  kegiatan: [],
  kegiatanLain: '',
  pendidikan: null,
  minat: [],
};

export function hasPreferences(preferences: PreferensiProfil): boolean {
  return Boolean(
    preferences.provinsi ||
    preferences.kota ||
    preferences.kegiatan.length > 0 ||
    preferences.kegiatanLain.trim() ||
    preferences.pendidikan ||
    preferences.minat.length > 0,
  );
}

export function profileCompleteness(preferences: PreferensiProfil): ProfileCompleteness {
  if (!hasPreferences(preferences)) return 'kosong';
  if (preferences.minat.length > 0 && (preferences.kegiatan.length > 0 || preferences.pendidikan)) {
    return 'cukup';
  }
  return 'sebagian';
}

export function preferredWilayah(preferences: PreferensiProfil): string | null {
  return preferences.kota ?? preferences.provinsi;
}

function targetGroups(preferences: PreferensiProfil): Set<ProfileGroup> {
  const groups = new Set<ProfileGroup>(
    preferences.kegiatan.flatMap((activity) => ACTIVITY_GROUPS[activity]),
  );
  if (
    preferences.kegiatan.includes('pelajar') &&
    preferences.pendidikan === SCHOOL_LEAVER_EDUCATION
  ) {
    groups.add('calon-mahasiswa');
  }
  return groups;
}

function regionalFit(
  program: Program,
  userWilayah: string | null,
  index: WilayahIndex,
): 'nasional' | 'setempat' | 'di-luar' {
  if (program.cakupan.level === 'nasional') return 'nasional';
  if (userWilayah === null) return 'di-luar';
  return appliesIn(program.cakupan.kode, userWilayah, index) ? 'setempat' : 'di-luar';
}

export function recommendPrograms(
  programs: readonly Program[],
  preferences: PreferensiProfil,
  options: RecommendationOptions,
): Recommendation[] {
  const userWilayah = preferredWilayah(preferences);
  const groups = targetGroups(preferences);
  const levels = preferences.pendidikan ? EDUCATION_LEVELS[preferences.pendidikan] : [];
  const results: Recommendation[] = [];

  for (const program of programs) {
    if (program.jenis !== 'program' || program.verifikasi === 'belum') continue;
    const fit = regionalFit(program, userWilayah, options.wilayahIndex);
    if (fit === 'di-luar') continue;

    const reasons: string[] = [];
    const checks: string[] = [];
    let score = 0;

    if (preferences.minat.includes(program.kategori as (typeof preferences.minat)[number])) {
      score += RECOMMENDATION_INTEREST_WEIGHT;
      reasons.push(`Bidang ${program.kategori} sesuai dengan minat yang kamu pilih.`);
    }
    const programGroups = program.kriteria?.flatMap((criterion) => criterion.kelompok) ?? [];
    if (programGroups.some((group) => groups.has(group))) {
      score += RECOMMENDATION_GROUP_WEIGHT;
      reasons.push('Sasaran program mencakup kegiatan yang kamu pilih.');
    }
    if (program.jenjang?.some((level) => levels.includes(level))) {
      score += RECOMMENDATION_LEVEL_WEIGHT;
      reasons.push('Jenjang pendidikan program sesuai dengan jenjangmu.');
    }
    if (reasons.length === 0) continue;

    if (fit === 'setempat') {
      score += RECOMMENDATION_LOCAL_WEIGHT;
      reasons.push(`Berlaku di ${wilayahName(options.wilayahIndex, program.cakupan.kode)}.`);
    } else if (userWilayah) {
      checks.push('Cakupan program nasional; lokasi pelaksanaan tetap perlu kamu periksa.');
    }

    const status = periodStatus(program.periode, options.today);
    if (status === 'ditutup') {
      score -= RECOMMENDATION_CLOSED_PENALTY;
      checks.push('Periode yang tercatat sudah ditutup. Periksa jadwal terbaru.');
    }
    if (status === 'belum-dibuka') checks.push('Periode yang tercatat belum dibuka.');

    results.push({ program, score, reasons, checks, periodStatus: status });
  }

  return results.sort(
    (left, right) =>
      right.score - left.score || left.program.nama.localeCompare(right.program.nama, 'id'),
  );
}
