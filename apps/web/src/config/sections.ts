import { ChartNoAxesCombined, Files, HeartHandshake, Route, HeartPulse } from 'lucide-react';
import type { Section } from './types';

export const SECTIONS: readonly Section[] = [
  {
    slug: 'program',
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
    icon: HeartPulse,
    warna: 'mint',
  },
  {
    slug: 'layanan',
    nama: 'Layanan Publik',
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
    slug: 'anggaran',
    nama: 'Telusuri Anggaran',
    deskripsi: 'Halaman anggaran dengan rujukan data yang jelas sedang disiapkan.',
    cta: 'Lihat anggaran',
    icon: ChartNoAxesCombined,
    warna: 'dark',
  },
];
