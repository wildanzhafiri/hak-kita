import { ChartNoAxesCombined, Files, HeartHandshake, Route, ScanHeart } from 'lucide-react';
import type { Section } from './types';

export const SECTIONS: readonly Section[] = [
  {
    slug: 'kenali-hakmu',
    nama: 'Kenali Hakmu',
    deskripsi: 'Temukan program bantuan yang sesuai dengan kebutuhanmu.',
    cta: 'Cari program',
    icon: HeartHandshake,
    warna: 'lime',
  },
  {
    slug: 'periksa-kondisimu',
    nama: 'Periksa Kondisimu',
    deskripsi: 'Pahami kondisi kesejahteraan dan siapkan langkah berikutnya.',
    cta: 'Mulai periksa',
    icon: ScanHeart,
    warna: 'mint',
  },
  {
    slug: 'urus-kebutuhanmu',
    nama: 'Urus Kebutuhanmu',
    deskripsi: 'Syarat dan langkah pengurusan layanan. Semua lebih jelas.',
    cta: 'Lihat panduan',
    icon: Files,
    warna: 'peach',
  },
  {
    slug: 'pantau-langkahmu',
    nama: 'Pantau Langkahmu',
    deskripsi: 'Lihat di mana proses pengurusan sering tersendat di daerahmu.',
    cta: 'Pantau langkah',
    icon: Route,
    warna: 'lavender',
  },
  {
    slug: 'awasi-uang-publik',
    nama: 'Awasi Uang Publik',
    deskripsi: 'Kenali prioritas dan telusuri penggunaan anggaran publik.',
    cta: 'Lihat anggaran',
    icon: ChartNoAxesCombined,
    warna: 'dark',
  },
];

export const SERVICE_MENU_COUNT = 4;

export const SERVICE_SECTIONS = SECTIONS.slice(0, SERVICE_MENU_COUNT);
