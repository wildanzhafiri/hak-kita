export const AUTH_ERROR_COPY = {
  invalidCredentials: 'Email atau kata sandi belum cocok.',
  emailTaken: 'Email ini sudah terdaftar. Coba masuk.',
  weakPassword: 'Gunakan kata sandi minimal 8 karakter.',
  generic: 'Akun belum dapat diproses. Coba lagi sebentar.',
  saveFailed: 'Akun berhasil masuk, tetapi program belum tersimpan. Coba simpan lagi.',
  callback: 'Tautan konfirmasi tidak dapat diproses. Minta email konfirmasi baru lalu coba lagi.',
  oauth: 'Masuk dengan Google belum berhasil. Periksa pengaturan Google di Supabase lalu coba lagi.',
} as const;

export const AUTH_FORM_COPY = {
  login: {
    title: 'Masuk ke HAKKITA',
    description: 'Masuk untuk menyimpan program ke akunmu dan membukanya kembali kapan saja.',
    googleLabel: 'Lanjutkan dengan Google',
    emailDivider: 'atau masuk dengan email',
    submit: 'Masuk',
    switchLabel: 'Belum punya akun?',
    switchAction: 'Daftar',
  },
  signup: {
    title: 'Buat akun HAKKITA',
    description: 'Simpan program pilihanmu ke akun agar bisa dibuka kembali.',
    googleLabel: 'Lanjutkan dengan Google',
    emailDivider: 'atau daftar dengan email',
    submit: 'Daftar',
    switchLabel: 'Sudah punya akun?',
    switchAction: 'Masuk',
  },
} as const;
