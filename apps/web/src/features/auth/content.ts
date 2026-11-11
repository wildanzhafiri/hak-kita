export const AUTH_ERROR_COPY = {
  invalidCredentials: 'Email atau kata sandi belum cocok.',
  emailTaken: 'Email ini sudah terdaftar. Coba masuk.',
  weakPassword: 'Gunakan kata sandi minimal 8 karakter.',
  generic: 'Akun belum dapat diproses. Coba lagi sebentar.',
  saveFailed: 'Akun berhasil masuk, tetapi program belum tersimpan. Coba simpan lagi.',
  callback: 'Tautan konfirmasi tidak dapat diproses. Minta email konfirmasi baru lalu coba lagi.',
  oauth:
    'Masuk dengan Google belum berhasil. Periksa pengaturan Google di Supabase lalu coba lagi.',
  admin: 'Akun ini belum memiliki akses admin HAKKITA.',
  adminSetup: 'Akses admin belum tersedia. Pastikan migrasi role admin sudah diterapkan.',
} as const;

export const AUTH_FIELD_ERROR_COPY = {
  nameRequired: 'Masukkan nama tampilan.',
  nameTooLong: 'Gunakan nama tampilan maksimal 60 karakter.',
  emailRequired: 'Masukkan alamat email.',
  emailInvalid: 'Periksa kembali format alamat email.',
  passwordRequired: 'Masukkan kata sandi.',
  passwordTooShort: 'Gunakan kata sandi minimal 8 karakter.',
} as const;

export const AUTH_FORM_COPY = {
  login: {
    title: 'Masuk ke HAKKITA',
    subtitle: 'Lanjutkan aktivitasmu dengan masuk ke akun HAKKITA.',
    emailDivider: 'atau masuk dengan email',
    passwordPlaceholder: 'Masukkan kata sandi',
    submit: 'Masuk',
    switchLabel: 'Belum punya akun?',
    switchAction: 'Daftar',
  },
  signup: {
    title: 'Buat akun HAKKITA',
    subtitle:
      'Simpan program pilihanmu dan temukan rekomendasi yang lebih sesuai dengan kebutuhanmu.',
    emailDivider: 'atau daftar dengan email',
    passwordPlaceholder: 'Buat kata sandi',
    submit: 'Buat akun',
    switchLabel: 'Sudah punya akun?',
    switchAction: 'Masuk',
  },
} as const;

export const AUTH_SHARED_COPY = {
  google: 'Lanjutkan dengan Google',
  googleConnecting: 'Membuka Google…',
  nameLabel: 'Nama Lengkap',
  namePlaceholder: 'Masukkan namamu',
  emailLabel: 'Alamat email',
  emailPlaceholder: 'nama@email.com',
  passwordLabel: 'Kata sandi',
  showPassword: 'Tampilkan kata sandi',
  hidePassword: 'Sembunyikan kata sandi',
  forgot: 'Lupa kata sandi?',
  processing: 'Memproses…',
  guest: 'Lanjut tanpa akun',
  privacy:
    'Akunmu digunakan untuk menyimpan program dan layanan pilihan. Kamu bisa melengkapi profil nanti untuk mendapatkan rekomendasi yang lebih sesuai.',
  privacyLink: 'Kebijakan Privasi',
  confirmEmail: 'Periksa emailmu untuk mengonfirmasi pendaftaran sebelum masuk.',
  unavailable:
    'Masuk dengan Google dan email belum tersedia. Kamu tetap bisa menjelajahi HAKKITA tanpa akun.',
} as const;

export const AUTH_RECOVERY_COPY = {
  title: 'Lupa kata sandi?',
  subtitle: 'Gunakan alamat email akunmu untuk memulihkan akses.',
  submit: 'Kirim tautan pemulihan',
  sent: 'Jika alamat email terdaftar, ikuti petunjuk pemulihan yang diberikan layanan autentikasi.',
  backToLogin: 'Kembali ke Masuk',
  failure: 'Tautan pemulihan belum dapat dikirim. Coba lagi sebentar.',
  unavailable: 'Pemulihan kata sandi belum tersedia. Belum ada email pemulihan yang dikirim.',
} as const;

export const AUTH_RESET_COPY = {
  title: 'Atur kata sandi baru',
  subtitle: 'Buat kata sandi baru untuk akunmu.',
  label: 'Kata sandi baru',
  placeholder: 'Buat kata sandi baru',
  submit: 'Simpan kata sandi',
  done: 'Kata sandi sudah diperbarui.',
  invalidLink: 'Tautan pemulihan tidak valid atau sudah kedaluwarsa. Minta tautan baru.',
  requestNew: 'Minta tautan baru',
  continue: 'Lanjutkan ke HAKKITA',
  failure: 'Kata sandi belum dapat diperbarui. Coba lagi sebentar.',
} as const;

export const ADMIN_AUTH_COPY = {
  title: 'Masuk Admin HAKKITA',
  description: 'Gunakan akun HAKKITA yang telah diberi akses untuk meninjau pembaruan informasi.',
} as const;
