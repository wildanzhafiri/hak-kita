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
  reloadHint: 'Temuan baru sudah masuk ke daftar tinjauan. Muat ulang bila belum tampil.',
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

export const PROGRAM_CANDIDATE_COPY = {
  description:
    'Temuan dari pencarian sumber resmi. Informasi yang disetujui langsung tampil di HAKKITA dengan status terverifikasi dasar, muncul di Kelola Informasi, dan tercatat di Riwayat Aktivitas.',
  openDraft: 'Lihat di Kelola Informasi',
  approveAction: 'Setujui & Publikasikan',
  correctAction: 'Perbaiki',
  correctionTitle: 'Perbaiki informasi sebelum dipublikasikan',
  correctionSaved: 'Perbaikan disimpan. Periksa isinya, lalu setujui bila sudah tepat.',
  correctionFailed: 'Perbaikan belum tersimpan. Coba lagi.',
  publishTitle: 'Publikasikan informasi ini?',
  publishDescription:
    'Informasi yang disetujui akan langsung tampil kepada pengguna HAKKITA. Pengiriman email ke pengikut dilakukan terpisah oleh admin. Pastikan sumber dan isinya sudah kamu periksa.',
  publishConfirm: 'Ya, publikasikan',
  approved: (name: string) => `${name} dipublikasikan dan sudah tampil di HAKKITA.`,
  rejected: (name: string) => `${name} ditolak dan tidak disimpan.`,
} as const;

export const RADAR_INDICATOR_COPY = {
  view: 'Lihat',
  dismiss: 'Tutup pemberitahuan',
  stillRunning: (elapsed: string) => `Tetap berjalan di latar belakang · ${elapsed}`,
} as const;

export const VALIDATION_COPY = {
  title: 'Validasi Informasi',
  description: 'Periksa informasi yang ditemukan sebelum ditampilkan di HAKKITA.',
  metrics: { total: 'Perlu diperiksa', created: 'Informasi baru', updates: 'Pembaruan' },
  searchLabel: 'Cari nama program atau layanan',
  kindLabel: 'Jenis informasi',
  allKinds: 'Semua jenis',
  findingLabel: 'Jenis temuan',
  allFindings: 'Semua temuan',
  findings: { new: 'Informasi baru', update: 'Pembaruan' },
  columns: {
    name: 'Nama informasi',
    kind: 'Jenis',
    finding: 'Temuan',
    summary: 'Ringkasan temuan',
    foundAt: 'Waktu ditemukan',
    action: 'Aksi',
  },
  review: 'Periksa',
  emptyTitle: 'Semua informasi sudah diperiksa',
  emptyDescription: 'Belum ada temuan baru yang memerlukan validasi.',
  noResultsTitle: 'Tidak ada hasil yang sesuai',
  noResultsDescription: 'Coba ubah kata kunci atau filter pilihanmu.',
  pagination: 'Halaman daftar validasi',
  back: 'Kembali ke Validasi Informasi',
  foundAt: (time: string) => `Ditemukan ${time}`,
  newsApproved: 'Kabar diterbitkan di halaman program.',
  newsRejected: 'Temuan ditolak dan tidak disimpan.',
  noTime: 'Belum tersedia',
} as const;

export const VALIDATION_DETAIL_COPY = {
  status: 'Perlu diperiksa',
  descriptions: {
    new: 'Informasi baru yang ditemukan Radar dari sumber resmi.',
    update: 'Perubahan yang terdeteksi pada sumber resmi program.',
  },
  sections: {
    newPreview: 'Pratinjau informasi baru',
    changeSummary: 'Ringkasan perubahan',
    sources: 'Sumber Informasi',
    actions: 'Tindakan validasi',
    correction: 'Perbaiki informasi sebelum dipublikasikan',
  },
  openSource: 'Buka sumber resmi',
  fullInfo: 'Lihat keseluruhan informasi',
  foundAt: (time: string) => `Ditemukan: ${time}`,
  evidence: 'Bukti / kutipan',
  noEvidence: 'Kutipan pendukung belum tersedia. Periksa informasi pada sumber asli.',
  noSources: 'Sumber belum tersedia. Lengkapi sumber sebelum menyetujui informasi.',
  notUnavailable: 'Belum tersedia',
  confirm: 'Saya sudah memeriksa kesesuaian informasi dengan sumber yang tersedia.',
  approve: 'Setujui & Publikasikan',
  correct: 'Perbaiki',
  reject: 'Tolak',
  saving: 'Menyimpan',
  pageChangeWarning:
    'Perubahan halaman belum tentu perubahan ketentuan. Cocokkan tanggal, wilayah, sasaran, dan isi kabar pada sumber sebelum menyetujui.',
  newsPublishTitle: 'Publikasikan kabar ini?',
  newsPublishDescription:
    'Kabar yang disetujui langsung tampil di halaman program. Email ke pengikut dikirim terpisah oleh admin.',
  newsRejectTitle: 'Tolak temuan ini?',
  newsRejectDescription:
    'Temuan akan keluar dari antrean tanpa tampil kepada pengguna atau dikirim lewat email.',
  confirmClose: 'Tutup konfirmasi',
  cancel: 'Batal',
  yesPublish: 'Ya, publikasikan',
  yesReject: 'Ya, tolak',
  newsFields: {
    title: 'Judul kabar',
    publishedOn: 'Tanggal terbit',
    summary: 'Ringkasan yang tampil di HAKKITA',
    emailText: 'Isi utama email',
    extraSources: 'Sumber resmi tambahan',
    extraSourcesHint: 'Satu URL per baris',
  },
  saveCorrection: 'Simpan perbaikan',
  programFields: {
    name: 'Nama',
    kind: 'Jenis',
    category: 'Kategori',
    organizer: 'Instansi',
    summary: 'Deskripsi singkat',
    about: 'Ringkasan informasi',
    audience: 'Untuk siapa',
    coverage: 'Wilayah',
    requirements: 'Persyaratan',
    steps: 'Langkah',
    documents: 'Dokumen',
    period: 'Jadwal pendaftaran',
    cost: 'Biaya',
    officialLink: 'Tautan resmi',
    yearRound: 'Sepanjang tahun',
  },
  backToList: 'Kembali ke daftar validasi',
} as const;
