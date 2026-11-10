import type { BudgetSector, BudgetSource } from './types';

export const ANGGARAN_CONTENT = {
  breadcrumbs: [{ label: 'Telusuri Anggaran' }],
  title: 'Telusuri Anggaran',
  description:
    'Jelajahi bagaimana anggaran pemerintah dialokasikan dan sejauh mana realisasinya berdasarkan data resmi.',
  apbdSourceUrl: 'https://djpk.kemenkeu.go.id/portal/data/apbd',
};

export const APBN_SOURCES: readonly BudgetSource[] = [
  {
    label: 'APBN KiTa Oktober 2026',
    url: 'https://www.kemenkeu.go.id/APBNKITAOktober2026',
    note: 'Realisasi sampai 30 September 2026.',
  },
  {
    label: 'UU Nomor 17 Tahun 2025, Lampiran I',
    url: 'https://jdih.kemenkeu.go.id/api/download/dab7680a-86cf-484e-8328-8652280ad718/2025UU17.pdf',
    note: 'Pagu belanja Pemerintah Pusat menurut fungsi pada APBN 2026.',
  },
  {
    label: 'Arah belanja Pemerintah Pusat 2026',
    url: 'https://anggaran.kemenkeu.go.id/in/post/apbn-2026:-belanja-prioritas-mewujudkan-kedaulatan-pangan,-energi,-dan-ekonomi',
    note: 'Uraian tujuan setiap fungsi anggaran dari Direktorat Jenderal Anggaran.',
  },
];

export const APBN_SECTORS: readonly BudgetSector[] = [
  {
    id: 'ekonomi',
    label: 'Ekonomi',
    allocation: 823.723184554,
    icon: 'economy',
    purpose: 'Mendukung teknologi, ketahanan pangan, transportasi, energi, UMKM, dan koperasi.',
  },
  {
    id: 'umum',
    label: 'Pelayanan Umum',
    allocation: 794.381705632,
    icon: 'public',
    purpose: 'Mendukung penyelenggaraan pemerintahan dan pelayanan umum kepada masyarakat.',
  },
  {
    id: 'pendidikan',
    label: 'Pendidikan',
    allocation: 459.692569843,
    icon: 'education',
    purpose: 'Mendukung peningkatan kualitas sumber daya manusia dan penyelenggaraan pendidikan.',
  },
  {
    id: 'pertahanan',
    label: 'Pertahanan',
    allocation: 337.371835237,
    icon: 'defense',
    purpose: 'Mendukung kedaulatan negara dan keutuhan wilayah Indonesia.',
  },
  {
    id: 'sosial',
    label: 'Perlindungan Sosial',
    allocation: 279.541562531,
    icon: 'social',
    purpose:
      'Mendukung jaminan, bantuan, dan pelayanan sosial bagi masyarakat yang menghadapi risiko sosial.',
  },
  {
    id: 'keamanan',
    label: 'Ketertiban dan Keamanan',
    allocation: 242.574768579,
    icon: 'security',
    purpose: 'Mendukung keamanan, ketertiban, penegakan hukum, dan penanggulangan bencana.',
  },
  {
    id: 'kesehatan',
    label: 'Kesehatan',
    allocation: 153.100068262,
    icon: 'health',
    purpose: 'Mendukung upaya menjaga dan meningkatkan kesehatan masyarakat.',
  },
  {
    id: 'perumahan',
    label: 'Perumahan dan Fasilitas Umum',
    allocation: 28.616530003,
    icon: 'housing',
    purpose: 'Mendukung akses perumahan, kawasan permukiman, dan fasilitas umum.',
  },
  {
    id: 'agama',
    label: 'Agama',
    allocation: 14.407406843,
    icon: 'religion',
    purpose: 'Mendukung kualitas kehidupan dan kerukunan hidup beragama.',
  },
  {
    id: 'lingkungan',
    label: 'Perlindungan Lingkungan Hidup',
    allocation: 13.358614384,
    icon: 'environment',
    purpose: 'Mendukung pelestarian sumber daya alam dan peningkatan kualitas lingkungan hidup.',
  },
  {
    id: 'pariwisata',
    label: 'Pariwisata',
    allocation: 2.965144892,
    icon: 'tourism',
    purpose: 'Mendukung fasilitas, kegiatan, informasi, dan promosi pariwisata.',
  },
];

export const APBN_SPENDING = [
  { label: 'Belanja Pemerintah Pusat', allocation: 3149.7, realization: 2061.3 },
  { label: 'Transfer ke Daerah', allocation: 693, realization: 599.2 },
] as const;

export const APBN_REVENUE = [
  { label: 'Pendapatan negara', allocation: 3153.6, realization: 2341.5 },
] as const;
