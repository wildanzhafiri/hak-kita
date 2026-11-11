import type { RadarRunKind } from '@hakkita/schema';

export const RADAR_RUN_COPY = {
  titles: {
    discovery: {
      running: 'Agen AI sedang mencari program baru',
      done: 'Pencarian selesai',
      failed: 'Pencarian berhenti sebelum selesai',
      stopped: 'Pencarian dihentikan',
    },
    monitoring: {
      running: 'Agen AI sedang memeriksa sumber resmi',
      done: 'Pemeriksaan selesai',
      failed: 'Pemeriksaan berhenti sebelum selesai',
      stopped: 'Pemeriksaan dihentikan',
    },
  },
  tally: {
    discovery: {
      examined: 'halaman dibaca',
      flagged: 'kandidat baru',
      setAside: 'putaran dilewati',
    },
    monitoring: { examined: 'sumber diperiksa', flagged: 'berubah', setAside: 'gagal' },
  },
  agents: {
    search: {
      name: 'Agen Pencari',
      headline: 'Agen Pencari menelusuri halaman resmi',
      detail: 'Mencari halaman .go.id yang cocok dengan topik putaran ini.',
    },
    read: {
      name: 'Agen Pembaca',
      headline: 'Agen Pembaca membuka halaman yang ditemukan',
      detail: 'Mengambil teks tiap halaman. Halaman yang melarang robot dilewati.',
    },
    draft: {
      name: 'Agen Penyusun',
      headline: 'Agen Penyusun membaca sumber dan menyusun draf',
      detail: 'Hanya fakta yang tertulis di halaman resmi yang boleh dipakai.',
    },
    check: {
      name: 'Agen Pemeriksa',
      headline: 'Agen Pemeriksa mencocokkan draf',
      detail: 'Memeriksa kutipan bukti, wilayah, dan daftar program yang sudah ada.',
    },
    monitor: {
      name: 'Agen Pemantau',
      headline: 'Agen Pemantau membandingkan halaman sumber',
      detail: 'Isi halaman sekarang dibandingkan dengan pemeriksaan terakhir.',
    },
  },
  agentStatus: {
    waiting: 'Menunggu',
    working: 'Bekerja',
    done: 'Selesai',
    skipped: 'Dilewati',
    failed: 'Gagal',
  },
  waitingNote: 'Menunggu giliran',
  starting: 'Menyiapkan agen',
  startingDetail: 'Langkah pertama biasanya muncul dalam beberapa detik.',
  agentListLabel: 'Agen yang bekerja',
  sourcesLabel: 'Sumber yang dibuka',
  roundsHeading: 'Hasil tiap putaran',
  dismissLabel: 'Tutup ringkasan',
  stopLabel: 'Hentikan',
  stopDetail: {
    discovery:
      'Temuan yang sudah selesai tetap tersimpan. Draf yang belum selesai dibuang dan tidak disimpan.',
    monitoring: 'Sumber yang sudah diperiksa tetap tercatat. Sisanya belum diperiksa.',
  },
  reloadLabel: 'Muat ulang halaman',
  reloadHint: 'Muat ulang halaman untuk melihat temuan baru di daftar tinjauan.',
  noFindingsHint: 'Tidak ada temuan baru. Alasan tiap putaran ada di bawah.',
  noChangesHint: 'Tidak ada sumber yang berubah sejak pemeriksaan terakhir.',
  failedDetail: 'Hasil sebelum agen berhenti tetap tercantum di bawah.',
  streamEndedMessage: 'Koneksi ke agen terputus sebelum pekerjaan selesai. Coba jalankan lagi.',
  requestFailedMessage: 'Agen belum dapat dijalankan.',
} as const;

export const RADAR_SKIP_REASON_COPY = {
  'no-pages': 'Tidak ada halaman resmi yang bisa dibaca.',
  'search-repeated':
    'Pencarian web tidak aktif, jadi sumber terdaftar yang sama tidak dibaca ulang.',
  'ai-not-configured': 'Model AI belum dikonfigurasi, jadi draf tidak bisa disusun.',
  'insufficient-evidence': 'Bukti di halaman belum cukup untuk menyusun draf yang aman.',
  'unknown-region': 'Wilayah program tidak ada di daftar wilayah HAKKITA.',
  'already-listed': 'Program ini sudah ada di HAKKITA.',
  'already-queued': 'Draf yang sama sudah menunggu tinjauan.',
  error: 'Langkah ini gagal.',
} as const;

export const RADAR_RUN_KIND_LABELS: Record<RadarRunKind, string> = {
  discovery: 'Putaran',
  monitoring: 'sumber',
};

export const RADAR_ADMIN_COPY = {
  title: 'Validasi Informasi',
  description:
    'Periksa temuan Radar dan cocokkan setiap klaim dengan sumber resmi sebelum kabar diterbitkan.',
} as const;
