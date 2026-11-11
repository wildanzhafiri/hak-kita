import type { Kategori, KategoriLayanan, TipeGerbang } from '@hakkita/schema';
import {
  BriefcaseBusiness,
  CarFront,
  Compass,
  ContactRound,
  Files,
  HeartPulse,
  House,
  LibraryBig,
  Receipt,
  type LucideIcon,
} from 'lucide-react';

export const DEFAULT_SEARCH_PLACEHOLDER = 'Cari program atau layanan...';

export const PROGRAM_CATEGORY_ARTWORK: Partial<Record<Kategori, string>> = {
  Pendidikan: '/program-category-icons/01_pendidikan_dan_beasiswa.png',
  Beasiswa: '/program-category-icons/01_pendidikan_dan_beasiswa.png',
  'Pekerjaan & Pelatihan': '/program-category-icons/02_pekerjaan_dan_karier.png',
  'Bantuan Sosial': '/program-category-icons/03_bantuan_sosial_dan_keluarga.png',
  'Pangan & Gizi': '/program-category-icons/03_bantuan_sosial_dan_keluarga.png',
  Kesehatan: '/program-category-icons/04_kesehatan_dan_kesejahteraan.png',
  'Usaha & UMKM': '/program-category-icons/05_usaha_dan_ekonomi.png',
  'Pertanian & Perikanan': '/program-category-icons/05_usaha_dan_ekonomi.png',
  Perumahan: '/program-category-icons/06_perumahan_dan_hunian.png',
};

export const PROGRAM_DETAIL_CATEGORY_LABELS: Partial<Record<Kategori, string>> = {
  Pendidikan: 'Pendidikan & Beasiswa',
  Beasiswa: 'Pendidikan & Beasiswa',
  'Pekerjaan & Pelatihan': 'Pekerjaan & Karier',
  'Bantuan Sosial': 'Bantuan Sosial & Keluarga',
  'Pangan & Gizi': 'Bantuan Sosial & Keluarga',
  Kesehatan: 'Kesehatan & Kesejahteraan',
  'Usaha & UMKM': 'Usaha & Ekonomi',
  'Pertanian & Perikanan': 'Usaha & Ekonomi',
  Perumahan: 'Perumahan & Hunian',
};

export const ALL_OPTION_VALUE = '__all__';

export const PERIOD_FILTER_OPTIONS = [
  { value: 'dibuka', label: 'Sedang dibuka' },
  { value: 'belum-dibuka', label: 'Akan dibuka' },
  { value: 'ditutup', label: 'Sudah ditutup' },
  { value: 'sepanjang-tahun', label: 'Sepanjang tahun' },
  { value: 'tidak-diketahui', label: 'Belum ada informasi periode' },
] as const;

export const SORT_OPTIONS = [
  { value: 'nama', label: 'Nama A-Z' },
  { value: 'terbaru', label: 'Pembaruan terbaru' },
  { value: 'tenggat', label: 'Tenggat terdekat' },
] as const;

export const SERVICE_CATEGORY_DETAILS: Record<
  KategoriLayanan | 'Layanan Administrasi',
  { icon: LucideIcon }
> = {
  'Kependudukan & Dokumen Pribadi': { icon: ContactRound },
  'Kendaraan & Transportasi': { icon: CarFront },
  'Kesehatan & Jaminan Sosial': { icon: HeartPulse },
  'Pekerjaan & Usaha': { icon: BriefcaseBusiness },
  Perpajakan: { icon: Receipt },
  'Pendidikan & Dokumen Akademik': { icon: LibraryBig },
  'Pertanahan & Bangunan': { icon: House },
  'Pengaduan & Informasi Publik': { icon: Compass },
  'Layanan Administrasi': { icon: Files },
};

export const SERVICE_CATEGORY_ORDER = [
  'Kependudukan & Dokumen Pribadi',
  'Kendaraan & Transportasi',
  'Kesehatan & Jaminan Sosial',
  'Pekerjaan & Usaha',
  'Perpajakan',
  'Pendidikan & Dokumen Akademik',
  'Pertanahan & Bangunan',
  'Pengaduan & Informasi Publik',
];

export const RESULT_PAGE_SIZE = 12;

export const SERVICE_PRIORITY = [
  'ktp-el',
  'paspor-baru',
  'perpanjangan-sim',
  'npwp',
  'kartu-keluarga',
  'pendaftaran-jkn',
  'sim-baru',
  'akta-kelahiran',
  'nib',
  'data-peserta-jkn',
] as const;

export const SERVICE_CHANNEL_LABELS = {
  online: 'Online',
  offline: 'Langsung',
  both: 'Online dan langsung',
} as const;

export const GERBANG_LABEL: Record<TipeGerbang, string> = {
  desil: 'Ditetapkan lewat data pemerintah (desil)',
  kategori: 'Syarat kategori umum',
  prosedur: 'Prosedur administrasi tanpa seleksi',
};
