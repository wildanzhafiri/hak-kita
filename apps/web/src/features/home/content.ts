import { BookOpen, RefreshCw, ShieldCheck } from 'lucide-react';
import type { PopularSearch, TitledText, TrustItem } from './types';

export const FEATURED_PROGRAM_COUNT = 3;

export const POPULAR_SEARCHES: readonly PopularSearch[] = [
  { label: 'Bantuan pendidikan', keyword: 'pendidikan' },
  { label: 'Cek desil', keyword: 'desil' },
  { label: 'Buat KTP', keyword: 'ktp' },
  { label: 'Kartu Prakerja', keyword: 'prakerja' },
];

export const HOW_IT_WORKS_STEPS: readonly TitledText[] = [
  {
    title: 'Cari yang kamu butuhkan',
    body: 'Mulai dari kebutuhan atau layanan yang ingin kamu urus.',
  },
  {
    title: 'Pahami informasinya',
    body: 'Kenali syarat, langkah, dan sumber resminya, lengkap dengan status verifikasi.',
  },
  {
    title: 'Siapkan langkahmu',
    body: 'Susun rencana pengurusan dari syarat dan dokumen yang perlu disiapkan.',
  },
  {
    title: 'Lanjutkan melalui kanal resmi',
    body: 'Ajukan langsung melalui penyelenggara terkait.',
  },
];

export const BUDGET_LABELS: readonly TitledText[] = [
  {
    title: 'Terhubung langsung',
    body: 'Dokumen menunjukkan kaitan program dengan angka anggaran pada cakupan yang sama.',
  },
  {
    title: 'Konteks sektor',
    body: 'Hanya ada data tingkat sektor, ditampilkan sebagai konteks dan bukan anggaran khusus program.',
  },
  {
    title: 'Belum tersedia',
    body: 'Rincian belum ditemukan atau belum diverifikasi, dan tidak pernah ditampilkan sebagai angka nol.',
  },
];

export const TRUST_ITEMS: readonly TrustItem[] = [
  {
    icon: ShieldCheck,
    title: 'Sumber yang transparan',
    body: 'Setiap entri menautkan sumber resmi dan tanggal pemeriksaannya.',
  },
  {
    icon: RefreshCw,
    title: 'Konteks pembaruan',
    body: 'Ketahui kapan terakhir diperiksa dan apakah periodenya masih dibuka.',
  },
  {
    icon: BookOpen,
    title: 'Jujur tentang batasan',
    body: 'Informasi yang belum diverifikasi selalu ditandai dengan jelas.',
  },
];
