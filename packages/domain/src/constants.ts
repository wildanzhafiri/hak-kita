import type { AgeBand, Kategori } from '@hakkita/schema';

export const KODE_NASIONAL = 'ID';

export const STALE_AFTER_DAYS = 90;

export const KATEGORI_LAYANAN: Kategori = 'Layanan Administrasi';

export const OFFICIAL_DOMAINS = ['go.id', 'desa.id'] as const;

export const MS_PER_DAY = 86_400_000;

export const MONTH_NAMES = [
  'Januari',
  'Februari',
  'Maret',
  'April',
  'Mei',
  'Juni',
  'Juli',
  'Agustus',
  'September',
  'Oktober',
  'November',
  'Desember',
] as const;

export const BERKAS_NOTE_MAX_LENGTH = 500;

export const AGE_BAND_LIMITS: Record<AgeBand, { minimum: number; maximum: number | null }> = {
  'di-bawah-18': { minimum: 0, maximum: 17 },
  '18-24': { minimum: 18, maximum: 24 },
  '25-59': { minimum: 25, maximum: 59 },
  '60-ke-atas': { minimum: 60, maximum: null },
};
export const DEFAULT_STEPS = [
  'Periksa informasi terbaru melalui kanal resmi.',
  'Siapkan dokumen sesuai ketentuan penyelenggara.',
  'Ikuti alur pengajuan melalui kanal resmi.',
  'Simpan bukti pengurusan dari penyelenggara, jika tersedia.',
] as const;

export const RANK_STOP_WORDS = new Set([
  'apa',
  'atau',
  'aku',
  'saya',
  'bagaimana',
  'gimana',
  'bisa',
  'buat',
  'bikin',
  'cara',
  'dan',
  'dari',
  'dengan',
  'di',
  'dong',
  'ini',
  'itu',
  'ke',
  'mau',
  'ingin',
  'minta',
  'pada',
  'tolong',
  'untuk',
  'yang',
  'ya',
  'kah',
  'lah',
  'nih',
  'sih',
  'mengurus',
  'urus',
  'pengurusan',
  'tahu',
  'kasih',
  'ada',
  'langkah',
  'syarat',
  'persyaratan',
  'berkas',
  'dokumen',
  'prosedur',
  'tahap',
  'tahapan',
]);
export const RANK_MIN_PREFIX_LENGTH = 5;
export const RANK_NAME_WEIGHT = 5;
export const RANK_ALIAS_WEIGHT = 4;
export const RANK_CATEGORY_WEIGHT = 2;
export const RANK_TEXT_WEIGHT = 1;
export const RANK_RELATIVE_THRESHOLD = 0.5;
