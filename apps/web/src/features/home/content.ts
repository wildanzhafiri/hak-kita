import { BookOpen, RefreshCw, ShieldCheck } from 'lucide-react';
import type { FaqItem } from '@/components/ui/types';
import type { PopularSearch, TitledText, TrustItem } from './types';

export const FEATURED_PROGRAM_COUNT = 6;

export const PROGRAM_CATEGORY_CARDS = [
  {
    label: 'Pendidikan & Beasiswa',
    filter: 'Pendidikan',
    image: '/program-category-icons/01_pendidikan_dan_beasiswa.png',
  },
  {
    label: 'Pekerjaan & Karier',
    filter: 'Pekerjaan & Pelatihan',
    image: '/program-category-icons/02_pekerjaan_dan_karier.png',
  },
  {
    label: 'Bantuan Sosial & Keluarga',
    filter: 'Bantuan Sosial',
    image: '/program-category-icons/03_bantuan_sosial_dan_keluarga.png',
  },
  {
    label: 'Kesehatan & Kesejahteraan',
    filter: 'Kesehatan',
    image: '/program-category-icons/04_kesehatan_dan_kesejahteraan.png',
  },
  {
    label: 'Usaha & Ekonomi',
    filter: 'Usaha & UMKM',
    image: '/program-category-icons/05_usaha_dan_ekonomi.png',
  },
  {
    label: 'Perumahan & Hunian',
    filter: 'Perumahan',
    image: '/program-category-icons/06_perumahan_dan_hunian.png',
  },
  {
    label: 'Dukungan Kelompok Rentan',
    filter: 'Bantuan Sosial',
    image: '/program-category-icons/07_dukungan_kelompok_rentan.png',
  },
] as const;

export const POPULAR_SEARCHES: readonly PopularSearch[] = [
  { label: 'Bantuan pendidikan', keyword: 'pendidikan' },
  { label: 'Persyaratan KIP Kuliah', keyword: 'kip-kuliah' },
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

export const HOME_FAQ_ITEMS = [
  {
    question: 'Apa itu HAKKITA?',
    answer:
      'HAKKITA adalah portal informasi independen untuk membantu masyarakat menemukan program pemerintah dan memahami cara mengakses layanan publik.',
  },
  {
    question: 'Apakah HAKKITA merupakan situs resmi pemerintah?',
    answer:
      'Bukan. HAKKITA merangkum informasi dengan merujuk pada sumber penyelenggara. Pengajuan dan pengurusan resmi tetap dilakukan melalui kanal instansi terkait.',
  },
  {
    question: 'Apakah program yang ditampilkan pasti sesuai untukku?',
    answer:
      'Belum tentu. Informasi HAKKITA merupakan panduan awal. Persyaratan dan keputusan akhir mengikuti ketentuan penyelenggara program.',
  },
  {
    question: 'Apakah saya perlu membuat akun untuk membaca informasi?',
    answer:
      'Tidak. Kamu dapat mencari dan membaca informasi program maupun layanan publik tanpa akun. Rencanaku menyimpan pilihan secara lokal di perangkatmu.',
  },
  {
    question: 'Apakah saya bisa mengajukan program melalui HAKKITA?',
    answer:
      'Tidak. HAKKITA menyediakan informasi dan panduan. Pengajuan dilakukan melalui kanal resmi penyelenggara yang tercantum pada halaman program.',
  },
  {
    question: 'Apakah HAKKITA menghitung desil atau menentukan penerima?',
    answer:
      'Tidak. HAKKITA tidak menghitung desil dan tidak menentukan penerima. Periksa status dan keputusan melalui kanal resmi.',
  },
  {
    question: 'Bagaimana jika ketentuan program atau layanan berubah?',
    answer:
      'Periksa tanggal pemeriksaan dan sumber pada halaman detail. Ketentuan terbaru tetap mengacu pada pengumuman penyelenggara resmi.',
  },
] satisfies readonly FaqItem[];
