export const PROFILE_COPY = {
  loadError: 'Profil belum dapat dimuat. Muat ulang halaman lalu coba lagi.',
  saveError: 'Perubahan belum berhasil disimpan. Coba lagi.',
  clearError: 'Informasi profil belum berhasil dihapus. Coba lagi.',
  nameRequired: 'Nama tidak boleh kosong.',
  loading: 'Memuat profilmu…',
} as const;

export const PROFILE_PAGE_COPY = {
  title: 'Profil Saya',
  description: 'Kelola informasi akun dan preferensi rekomendasimu.',
  preferencesHeading: 'Preferensi Rekomendasi',
  emptyTitle: 'Belum ada preferensi tersimpan',
  emptyDescription:
    'Isi preferensimu agar HAKKITA dapat membantu menemukan program yang lebih relevan.',
  setAction: 'Atur preferensi',
  changeAction: 'Ubah preferensi',
  settingsHeading: 'Pengaturan akun',
  clearTitle: 'Hapus informasi profil',
  clearDescription: 'Hapus preferensi rekomendasi tanpa menghapus akun atau program yang disimpan.',
  signOutTitle: 'Keluar dari akun',
  signOutDescription: 'Akhiri sesi akun ini.',
  clearDialogTitle: 'Hapus informasi profil?',
  clearDialogDescription:
    'Wilayah, kegiatan, jenjang pendidikan, dan minat program yang kamu simpan akan dihapus. Akun dan Rencanaku tetap tersedia.',
  clearConfirm: 'Hapus informasi',
  clearing: 'Menghapus…',
  cancel: 'Batal',
  saved: 'Preferensimu sudah disimpan.',
  cleared: 'Informasi profil sudah dihapus.',
  rows: {
    region: 'Wilayah domisili',
    activities: 'Kegiatan saat ini',
    education: 'Jenjang pendidikan',
    interests: 'Minat program',
  },
} as const;

export const PROFILE_EDITOR_COPY = {
  breadcrumbProfile: 'Profil Saya',
  title: 'Atur Preferensi',
  description:
    'Pilih informasi yang sesuai dengan dirimu untuk mendapatkan rekomendasi program yang lebih relevan.',
  nameLabel: 'Nama',
  noSelection: 'Tidak dipilih',
  regionHeading: 'Wilayah domisili',
  regionHint: 'Pilih wilayah tempat tinggalmu untuk menemukan program yang tersedia di daerahmu.',
  provinceLabel: 'Provinsi',
  provincePlaceholder: 'Pilih provinsi',
  cityLabel: 'Kabupaten/kota',
  cityPlaceholder: 'Pilih kabupaten/kota',
  cityNeedsProvince: 'Pilih provinsi dahulu',
  activitiesHeading: 'Kegiatan saat ini',
  activitiesHint:
    'Pilih kegiatan yang sesuai dengan keseharianmu. Kamu bisa memilih lebih dari satu.',
  activitiesOtherLabel: 'Kegiatan lainnya (opsional)',
  activitiesOtherHint: 'Catatan ini belum digunakan untuk mencocokkan program.',
  educationHeading: 'Jenjang pendidikan',
  educationHint: 'Pilih jenjang pendidikanmu saat ini atau yang terakhir diselesaikan.',
  educationLabel: 'Jenjang pendidikan',
  educationPlaceholder: 'Pilih jenjang pendidikan',
  interestsHeading: 'Minat program',
  interestsHint: 'Pilih kategori program yang kamu minati. Kamu bisa memilih lebih dari satu.',
  save: 'Simpan preferensi',
  saving: 'Menyimpan…',
  cancel: 'Batal',
  skip: 'Lewati untuk sekarang',
  unsavedTitle: 'Tinggalkan perubahan?',
  unsavedDescription:
    'Perubahan profilmu belum disimpan. Jika kamu meninggalkan halaman ini, perubahan tersebut akan hilang.',
  unsavedStay: 'Tetap mengedit',
  unsavedLeave: 'Tinggalkan',
  unsavedClose: 'Tutup konfirmasi',
} as const;

export const ACCOUNT_MENU_COPY = {
  label: 'Menu profil',
  profile: 'Profil Saya',
  plan: 'Rencanaku',
  signOut: 'Keluar',
} as const;

export const WELCOME_COPY = {
  breadcrumb: 'Selamat datang',
  title: 'Selamat datang di HAKKITA!',
  description:
    'Kamu bisa mulai menjelajahi program atau menambahkan informasi untuk mendapatkan rekomendasi yang lebih personal.',
  complete: 'Lengkapi profil',
  explore: 'Jelajahi HAKKITA',
} as const;

export const ACCOUNT_GATE_COPY = {
  description: 'Kamu tetap bisa mencari dan membaca seluruh program serta layanan tanpa akun.',
  action: 'Masuk atau daftar',
  explore: 'Jelajahi tanpa akun',
  profileTitle: 'Profilmu membantu memberi arah.',
  editorTitle: 'Lengkapi profil sesuai kebutuhanmu.',
  recommendationTitle: 'Rekomendasi mengikuti informasi yang kamu pilih.',
  welcomeTitle: 'Masuk untuk melanjutkan.',
} as const;

export const RECOMMENDATION_COPY = {
  catalogBreadcrumb: 'Kenali Hakmu',
  title: 'Rekomendasi Untukmu',
  description:
    'Pilihan yang dihitung dari informasi yang kamu berikan dan persyaratan pada sumber resmi.',
  completeness: {
    kosong: 'Belum ada informasi profil',
    sebagian: 'Profil sebagian terisi',
    cukup: 'Cukup untuk rekomendasi awal',
  },
  updateProfile: 'Perbarui profil',
  note: 'Rekomendasi hanya menunjukkan program yang berpotensi relevan. Keputusan penerimaan mengikuti penyelenggara, bukan hasil rekomendasi ini.',
  potential: 'Berpotensi relevan',
  checksLabel: 'Perlu diperiksa',
  emptyProfileTitle: 'Belum ada informasi profil',
  emptyProfileDescription:
    'Isi preferensimu agar HAKKITA dapat menyarankan program yang lebih relevan.',
  emptyProfileAction: 'Atur preferensi',
  emptyMatchTitle: 'Belum ditemukan program berdasarkan informasi profilmu.',
  emptyMatchDescription:
    'Informasi tambahan atau pilihan bidang lain dapat membantu. Kamu tetap dapat menelusuri seluruh katalog.',
  emptyMatchAction: 'Ubah preferensi',
  browse: 'Jelajahi semua program',
  loadError: 'Rekomendasi belum dapat dimuat. Muat ulang halaman lalu coba lagi.',
} as const;

export const HOME_PERSONALIZATION_COPY = {
  guest: 'Ingin rekomendasi yang lebih sesuai kebutuhanmu?',
  guestAction: 'Buat akun dan lengkapi profilmu.',
  incompleteAction: 'Lengkapi profilmu.',
  ready: 'Temukan program berdasarkan profilmu.',
  readyAction: 'Lihat rekomendasi.',
  generalHeading: 'Program Unggulan',
  personalHeading: 'Rekomendasi untukmu',
} as const;
