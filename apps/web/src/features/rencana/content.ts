export const RENCANA_SUMMARY_CONTENT = {
  href: '/rencanaku',
  title: 'Lanjutkan dari tempat kamu berhenti.',
  description: 'Berkas, program tersimpan, dan tenggatmu dalam satu tempat.',
};

export const RENCANA_PAGE_CONTENT = [
  RENCANA_SUMMARY_CONTENT,
  {
    href: '/rencanaku/berkas',
    title: 'Berkas yang kamu siapkan',
    description: 'Lihat dokumen yang sudah kamu tandai dan lanjutkan persiapannya.',
  },
  {
    href: '/rencanaku/tersimpan',
    title: 'Program tersimpan',
    description: 'Kembali ke program yang ingin kamu pelajari atau urus.',
  },
  {
    href: '/rencanaku/tenggat',
    title: 'Tenggat program',
    description: 'Periksa tanggal dari program yang kamu simpan atau siapkan berkasnya.',
  },
] as const;

export const STEP_GUIDE_CONTENT = {
  helpUnavailable:
    'Belum ada panduan kendala khusus untuk langkah ini. Periksa petunjuk terbaru di kanal resmi.',
  helpIntro: 'Pilih kendala berkas yang sesuai. Periksa kembali petunjuk pada sumbernya.',
  sourceLabel: 'Buka kanal resmi',
  detailsLabel: 'Lihat rincian program',
  reportLabel: 'Laporkan kendala secara anonim',
  reportIntro:
    'Jika petunjuk ini belum membantu, kamu bisa mencatat tahap yang menghambat. Laporan tidak mengubah status pengajuanmu.',
  reportUnavailable:
    'Laporan anonim belum dapat dikirim saat ini. Kamu tetap bisa membuka kanal resmi untuk meminta bantuan.',
  reportConsent: 'Saya setuju mengirim tahap kendala ini sebagai laporan anonim.',
  reportPrivacy: 'Tanpa nama, NIK, atau dokumen. Wilayah belum dicatat dalam laporan ini.',
  reportSuccess:
    'Laporan anonim sudah diterima. Terima kasih sudah membantu menunjukkan tahap yang membingungkan.',
  reportError: 'Laporan belum berhasil dikirim. Coba lagi nanti.',
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

export const OBSTACLE_STAGE_OPTIONS = [
  { value: 'mencari-informasi', label: 'Mencari informasi' },
  { value: 'memenuhi-persyaratan', label: 'Memenuhi persyaratan' },
  { value: 'menyiapkan-berkas', label: 'Menyiapkan berkas' },
  { value: 'mengajukan', label: 'Mengajukan' },
  { value: 'menunggu-verifikasi', label: 'Menunggu verifikasi' },
  { value: 'mengikuti-seleksi', label: 'Mengikuti seleksi' },
  { value: 'menerima-hasil', label: 'Menerima hasil' },
] as const;
