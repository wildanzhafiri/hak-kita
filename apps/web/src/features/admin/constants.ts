import {
  KATEGORI_LAYANAN,
  KATEGORI_PROGRAM,
  JENIS_SUMBER,
  LEVEL_WILAYAH,
  TIPE_GERBANG,
  TINGKAT_VERIFIKASI,
} from '@hakkita/schema';
import type { JenisProgram } from '@hakkita/schema';

export const ADMIN_KIND_BADGE_CLASSES: Record<JenisProgram, string> = {
  program: 'border-[#c9defe] bg-[#eef5ff] text-[#235ca8]',
  layanan: 'border-[#bce5df] bg-[#eff9f7] text-[#28776b]',
};

export const ADMIN_KIND_LABELS: Record<JenisProgram, string> = {
  program: 'Program',
  layanan: 'Layanan',
};

export const ADMIN_KIND_FILTER_OPTIONS = [
  { value: 'all', label: 'Semua jenis' },
  { value: 'program', label: ADMIN_KIND_LABELS.program },
  { value: 'layanan', label: ADMIN_KIND_LABELS.layanan },
];

export const ADMIN_CATEGORY_OPTIONS_BY_KIND = {
  program: KATEGORI_PROGRAM.map((kategori) => ({ value: kategori, label: kategori })),
  layanan: KATEGORI_LAYANAN.map((kategori) => ({ value: kategori, label: kategori })),
} as const;

export const ADMIN_DEFAULT_CATEGORY_BY_KIND = {
  program: 'Pendidikan',
  layanan: 'Kependudukan & Dokumen Pribadi',
} as const;

export const ADMIN_KIND_OPTIONS = [
  { value: 'program', label: 'Program' },
  { value: 'layanan', label: 'Layanan' },
];

export const ADMIN_COVERAGE_OPTIONS = [
  { value: LEVEL_WILAYAH[0], label: 'Nasional' },
  { value: LEVEL_WILAYAH[1], label: 'Provinsi' },
  { value: LEVEL_WILAYAH[2], label: 'Kabupaten atau kota' },
];

export const ADMIN_GATE_OPTIONS = [
  { value: TIPE_GERBANG[0], label: 'Pemeriksaan desil oleh pemerintah' },
  { value: TIPE_GERBANG[1], label: 'Kriteria kelompok' },
  { value: TIPE_GERBANG[2], label: 'Prosedur layanan' },
];

export const ADMIN_SOURCE_TYPE_OPTIONS = [
  { value: JENIS_SUMBER[0], label: 'Peraturan' },
  { value: JENIS_SUMBER[1], label: 'Situs resmi' },
  { value: JENIS_SUMBER[2], label: 'Portal data' },
  { value: JENIS_SUMBER[3], label: 'Bank penyalur' },
];

export const ADMIN_PERIOD_OPTIONS = [
  { value: 'none', label: 'Belum ditentukan' },
  { value: 'year-round', label: 'Sepanjang tahun' },
  { value: 'date-range', label: 'Periode dengan tanggal' },
];

export const ADMIN_VERIFICATION_OPTIONS = [
  { value: TINGKAT_VERIFIKASI[2], label: 'Belum diverifikasi' },
  { value: TINGKAT_VERIFIKASI[1], label: 'Dasar' },
  { value: TINGKAT_VERIFIKASI[0], label: 'Lengkap' },
];

export const ADMIN_MAX_ADDITIONAL_SOURCES = 10;

export const ADMIN_PAGE_SIZE = 10;
