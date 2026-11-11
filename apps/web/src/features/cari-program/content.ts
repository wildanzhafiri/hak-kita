import type { FinderStepId } from './types';

export const FINDER_COPY = {
  title: 'Cari Program untukmu',
  intro:
    'Jawab beberapa pertanyaan agar kami bisa membantu menemukan program yang sesuai dengan kebutuhanmu.',
  closeLabel: 'Tutup dialog',
  progressLabel: 'Langkah',
  progressOf: 'dari',
  close: 'Tutup',
  back: 'Kembali',
  skip: 'Lewati',
  next: 'Lanjutkan',
  showResults: 'Lihat rekomendasi',
  noSelection: 'Tidak dipilih',
  provinceLabel: 'Provinsi',
  provincePlaceholder: 'Pilih provinsi',
  cityLabel: 'Kabupaten/kota',
  cityPlaceholder: 'Pilih kabupaten/kota',
  cityNeedsProvince: 'Pilih provinsi dahulu',
  regionsLoading: 'Memuat daftar wilayah…',
  regionsError: 'Daftar wilayah belum dapat dimuat. Kamu bisa melewati langkah ini.',
  profileChoiceTitle: 'Gunakan informasi profilmu?',
  profileChoiceDescription:
    'Kamu bisa menggunakan preferensi yang sudah disimpan atau menjawab pertanyaan baru.',
  useProfile: 'Gunakan profil saya',
  startFresh: 'Jawab dari awal',
  resultsTitle: 'Program yang mungkin sesuai untukmu',
  summaryLabel: 'Ringkasan jawaban',
  summaryMore: 'lainnya',
  loadingResults: 'Mencari program yang sesuai…',
  resultsError: 'Rekomendasi belum dapat dimuat. Coba lagi beberapa saat lagi.',
  emptyTitle: 'Belum menemukan program yang sesuai',
  emptyDescription:
    'Coba ubah beberapa jawabanmu atau jelajahi program lain yang tersedia di HAKKITA.',
  browseAll: 'Lihat semua program',
  editAnswers: 'Ubah jawaban',
  whyHeading: 'Mengapa ditampilkan',
  checksLabel: 'Perlu diperiksa',
  statusOpen: 'Pendaftaran dibuka',
  statusUpcoming: 'Periode pendaftaran akan datang',
  statusClosed: 'Periode pendaftaran berakhir',
} as const;

export const FINDER_STEP_COPY: Record<FinderStepId, { title: string; description: string }> = {
  minat: {
    title: 'Program seperti apa yang sedang kamu cari?',
    description: 'Pilih satu atau beberapa kategori yang kamu butuhkan.',
  },
  kegiatan: {
    title: 'Apa kegiatanmu saat ini?',
    description: 'Kamu bisa memilih lebih dari satu jika sesuai.',
  },
  wilayah: {
    title: 'Di mana kamu tinggal?',
    description:
      'Wilayah tempat tinggal membantu kami menemukan program yang tersedia di daerahmu.',
  },
  pendidikan: {
    title: 'Apa jenjang pendidikanmu?',
    description: 'Pilih jenjang yang sedang atau terakhir kamu tempuh.',
  },
};

export const FINDER_STEP_LEGENDS: Record<FinderStepId, string> = {
  minat: 'Kategori program',
  kegiatan: 'Kegiatan saat ini',
  wilayah: 'Wilayah domisili',
  pendidikan: 'Jenjang pendidikan',
};
