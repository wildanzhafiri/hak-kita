export const RENCANA_PAGE_CONTENT = [
  {
    href: '/rencanaku',
    title: 'Rencanaku',
    description: 'Simpan program dan layanan pilihanmu agar mudah dibuka kembali.',
  },
] as const;

export const SAVED_INFORMATION_TABS = [
  {
    id: 'program',
    label: 'Program',
    emptyTitle: 'Belum ada program yang disimpan',
    emptyDescription: 'Simpan program pilihanmu agar mudah dibuka kembali dari Rencanaku.',
    browseHref: '/kenali-hakmu',
    browseLabel: 'Jelajahi program',
  },
  {
    id: 'layanan',
    label: 'Layanan Publik',
    emptyTitle: 'Belum ada layanan yang disimpan',
    emptyDescription: 'Simpan panduan layanan yang kamu butuhkan agar mudah ditemukan kembali.',
    browseHref: '/layanan',
    browseLabel: 'Jelajahi layanan',
  },
] as const;

export const STEP_GUIDE_CONTENT = {
  helpUnavailable:
    'Belum ada petunjuk khusus untuk kendala ini. Tanya HAKKITA untuk mencari arahan dan sumber yang relevan.',
  helpIntro: 'Pilih kendala berkas yang sesuai. Periksa kembali petunjuk pada sumbernya.',
  sourceLabel: 'Buka kanal resmi',
  askAssistant: 'Tanya HAKKITA',
};

export const FOLLOW_CHANGE_LABELS = {
  periode: 'Periode pendaftaran berubah',
  dibuka: 'Pendaftaran dibuka sesuai jadwal yang tercatat',
  ditutup: 'Pendaftaran ditutup sesuai jadwal yang tercatat',
  tenggat: 'Tenggat pendaftaran tinggal tujuh hari atau kurang',
  syarat: 'Persyaratan berubah',
  dokumen: 'Daftar dokumen berubah',
  verifikasi: 'Status pemeriksaan sumber berubah',
} as const;

export const FOLLOW_UPDATES_CONTENT = {
  title: 'Program yang kamu ikuti',
  intro: 'Pembaruan terlihat di sini saat data program terverifikasi berubah dan situs diperbarui.',
  empty: 'Belum ada program yang kamu ikuti. Buka halaman detail program untuk mulai mengikuti.',
  noChanges: 'Belum ada perubahan baru pada program ini.',
  unknown: 'Program ini belum ada dalam data saat ini.',
  source: 'Periksa sumber resmi',
  seen: 'Tandai sudah dibaca',
  stop: 'Berhenti mengikuti',
  retry: 'Coba lagi',
} as const;

export const EMAIL_NOTIFICATION_CONTENT = {
  title: 'Pemberitahuan email',
  description:
    'Terima email saat informasi program yang kamu ikuti berubah atau ada kabar resmi yang kami tambahkan. Kami memeriksanya setiap hari. Tetap periksa ketentuan terbaru di sumber resmi.',
  enable: 'Aktifkan email',
  disable: 'Matikan email',
  active: 'Email aktif untuk program yang kamu ikuti.',
  inactive: 'Email belum aktif.',
  loading: 'Memuat pengaturan email',
  retry: 'Coba lagi',
} as const;

export const RENCANA_GATE_COPY = {
  breadcrumb: 'Rencanaku',
  title: 'Rencanaku',
  description:
    'Simpan program dan layanan pilihanmu, siapkan kebutuhan, dan dapatkan pengingat penting.',
  gateTitle: 'Masuk untuk melihat Rencanaku',
  gateDescription:
    'Masuk atau buat akun agar kamu bisa menyimpan program dan layanan, mencatat persiapan, serta mendapatkan pengingat.',
  signIn: 'Masuk / Daftar',
  explore: 'Jelajahi program',
} as const;

export const RENCANA_LOADING_LABEL = 'Memuat Rencanaku';
