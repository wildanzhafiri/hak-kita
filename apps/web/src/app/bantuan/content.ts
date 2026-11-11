import type { FaqItem } from '@/components/ui/types';

export const BANTUAN_PAGE_CONTENT = {
  title: 'Ada yang ingin kamu pahami?',
  description: 'Jawaban untuk membantu langkahmu di HAKKITA.',
  browseLink: 'Kembali mencari informasi',
} as const;

export const BANTUAN_FAQ_ITEMS = [
  {
    question: 'Apa itu HAKKITA?',
    answer:
      'HAKKITA adalah portal informasi independen yang membantu masyarakat menemukan program pemerintah dan memahami cara mengakses layanan publik.',
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
      'Tidak. Kamu dapat mencari dan membaca informasi program maupun layanan publik tanpa akun.',
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
  {
    question: 'Bagaimana Tanya HAKKITA membantu menjawab pertanyaan?',
    answer:
      'Tanya HAKKITA mencari jawaban dari informasi program, layanan, kabar program, dan data anggaran yang tersedia. Periksa rujukan yang disertakan untuk memastikan ketentuan terbaru.',
  },
] satisfies readonly FaqItem[];
