import {
  KATEGORI_LAYANAN,
  KATEGORI_PROGRAM,
  JENIS_SUMBER,
  KATEGORI,
  LEVEL_WILAYAH,
  TIPE_GERBANG,
  TINGKAT_VERIFIKASI,
} from '@hakkita/schema';
import type { Kategori } from '@hakkita/schema';

export const ADMIN_CATEGORY_BADGE_CLASSES: Record<Kategori, string> = {
  Pendidikan: 'border-[#c9defe] bg-[#eef5ff] text-[#235ca8]',
  Beasiswa: 'border-[#ded3ff] bg-[#f4f0ff] text-[#6445a5]',
  Kesehatan: 'border-[#bde8d3] bg-[#effaf4] text-[#26734d]',
  'Bantuan Sosial': 'border-[#ffd8bf] bg-[#fff5ed] text-[#a85524]',
  'Pangan & Gizi': 'border-[#d9e9a8] bg-[#f6fae9] text-[#617d22]',
  'Pekerjaan & Pelatihan': 'border-[#bce6ef] bg-[#effafd] text-[#247187]',
  'Usaha & UMKM': 'border-[#f3dda0] bg-[#fff9e8] text-[#8b6715]',
  Perumahan: 'border-[#d6d9f6] bg-[#f3f3ff] text-[#555b9b]',
  'Pertanian & Perikanan': 'border-[#bce5df] bg-[#eff9f7] text-[#28776b]',
  'Layanan Administrasi': 'border-[#f2c7a5] bg-[#fff5ed] text-[#91451d]',
  'Kependudukan & Dokumen Pribadi': 'border-[#c9defe] bg-[#eef5ff] text-[#235ca8]',
  'Kendaraan & Transportasi': 'border-[#bce6ef] bg-[#effafd] text-[#247187]',
  'Kesehatan & Jaminan Sosial': 'border-[#bde8d3] bg-[#effaf4] text-[#26734d]',
  'Pekerjaan & Usaha': 'border-[#f3dda0] bg-[#fff9e8] text-[#8b6715]',
  Perpajakan: 'border-[#ded3ff] bg-[#f4f0ff] text-[#6445a5]',
  'Pendidikan & Dokumen Akademik': 'border-[#c9defe] bg-[#eef5ff] text-[#235ca8]',
  'Pertanahan & Bangunan': 'border-[#d6d9f6] bg-[#f3f3ff] text-[#555b9b]',
  'Pengaduan & Informasi Publik': 'border-[#bce5df] bg-[#eff9f7] text-[#28776b]',
};

export const ADMIN_CATEGORY_FILTER_OPTIONS = [
  { value: 'all', label: 'Semua kategori' },
  ...KATEGORI.map((kategori) => ({ value: kategori, label: kategori })),
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
