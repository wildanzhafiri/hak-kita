export const SIGN_OUT_DIALOG_TITLE = 'Keluar dari akun?';
export const SIGN_OUT_DIALOG_DESCRIPTION =
  'Setelah keluar, kamu harus masuk kembali untuk mengakses data kamu.';
export const SIGN_OUT_FAILURE_COPY = 'Kamu belum berhasil keluar. Coba lagi.';

export const ADMIN_NAVIGATION = [
  {
    href: '/admin/validasi',
    section: 'validation',
    icon: 'clipboard',
    label: 'Validasi Informasi',
  },
  {
    href: '/admin/informasi',
    section: 'programs',
    icon: 'files',
    label: 'Kelola Informasi',
  },
  {
    href: '/admin/riwayat',
    section: 'history',
    icon: 'history',
    label: 'Riwayat Aktivitas',
  },
] as const;

export const ADMIN_SIGN_OUT_FAILURE_COPY =
  'Kamu belum berhasil keluar dari panel admin. Coba lagi.';
