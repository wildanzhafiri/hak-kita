import type { AgeBand, Kategori } from '@hakkita/schema';

export const KODE_NASIONAL = 'ID';

export const STALE_AFTER_DAYS = 90;

export const KATEGORI_LAYANAN: Kategori = 'Layanan Administrasi';

export const OFFICIAL_DOMAIN = 'go.id';

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
