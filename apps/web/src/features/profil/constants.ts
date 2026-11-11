import { AKTIVITAS_PROFIL, JENJANG_PENDIDIKAN_PROFIL, KATEGORI_PROGRAM } from '@hakkita/schema';
import type { AktivitasProfil, JenjangPendidikanProfil } from '@hakkita/schema';

export const ACTIVITY_LABELS: Record<AktivitasProfil, string> = {
  pelajar: 'Pelajar',
  mahasiswa: 'Mahasiswa',
  bekerja: 'Bekerja',
  'mencari-kerja': 'Mencari pekerjaan',
  usaha: 'Memiliki usaha',
  lainnya: 'Lainnya',
};

export const EDUCATION_LABELS: Record<JenjangPendidikanProfil, string> = {
  sd: 'SD/sederajat',
  smp: 'SMP/sederajat',
  sma: 'SMA/SMK/sederajat',
  diploma: 'Diploma (D1–D4)',
  sarjana: 'Sarjana (S1)',
  pascasarjana: 'Pascasarjana (S2/S3)',
};

export const ACTIVITY_OPTIONS = AKTIVITAS_PROFIL.map((value) => ({
  value,
  label: ACTIVITY_LABELS[value],
}));

export const EDUCATION_OPTIONS = JENJANG_PENDIDIKAN_PROFIL.map((value) => ({
  value,
  label: EDUCATION_LABELS[value],
}));

export const INTEREST_OPTIONS = KATEGORI_PROGRAM.map((value) => ({ value, label: value }));

export const HOME_RECOMMENDATION_COUNT = 6;

export const NO_SELECTION = '__tidak-dipilih__';
