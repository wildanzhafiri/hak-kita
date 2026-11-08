export const DETAIL_TABS = [
  { id: 'ringkasan', label: 'Ringkasan' },
  { id: 'persyaratan', label: 'Persyaratan' },
  { id: 'langkah', label: 'Langkah berikutnya' },
] as const;

export const FOLLOW_PROGRAM_CONTENT = {
  follow: 'Ikuti program',
  unfollow: 'Berhenti mengikuti',
  description: 'Ikuti untuk melihat kabar perubahan periode, syarat, atau dokumen di Rencanaku.',
  promptTitle: 'Masuk untuk mengikuti program',
  promptDescription: 'Masuk atau buat akun agar pembaruan program ini muncul di Rencanaku.',
  offline: 'Fitur mengikuti program memerlukan akun yang terhubung.',
} as const;
