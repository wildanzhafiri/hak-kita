import type { AgeOption, ConditionOption, ConditionQuestionContent, GroupOption } from './types';

export const CONDITION_ACCOUNT_COPY = {
  title: 'Penyimpanan jawaban',
  local: 'Jawabanmu tersimpan di perangkat ini.',
  accountPrompt: 'Simpan jawaban ke akunku',
  accountDescription: 'Jika diaktifkan, jawaban profil ini disimpan di akunmu.',
  accountDeleteHint: 'Matikan pilihan ini untuk menghapus profil dari akunmu.',
  localOnly: 'Jawabanmu disimpan di perangkat, kecuali kamu memilih menyimpannya ke akun.',
  signIn: 'Masuk untuk menyimpan jawaban ke akunmu. Tanpa akun, jawaban tetap di perangkat ini.',
  loading: 'Memeriksa profil yang tersimpan di akunmu.',
  saving: 'Menyimpan perubahan profil.',
  loadingError: 'Profil akun belum dapat dimuat. Jawaban di perangkat tetap bisa digunakan.',
  saveError: 'Profil belum berhasil disimpan ke akun. Coba lagi.',
  deleteError: 'Profil belum berhasil dihapus dari akun. Coba lagi.',
};

export const QUESTIONS: ConditionQuestionContent[] = [
  {
    key: 'kelompok',
    title: 'Untuk siapa kamu mencari program?',
    description: 'Pilih kelompok yang paling dekat dengan kebutuhanmu saat ini.',
  },
  {
    key: 'rentangUsia',
    title: 'Berapa rentang usiamu?',
    description: 'Beberapa program mempunyai batas usia. Kami hanya memakai rentangnya.',
  },
  {
    key: 'wilayah',
    title: 'Di mana domisilimu?',
    description: 'Daftar wilayah yang tersedia masih terbatas. Pilih wilayah lain bila belum ada.',
  },
  {
    key: 'tahunLulus',
    title: 'Kapan kamu lulus SMA atau sederajat?',
    description: 'Pertanyaan ini membantu memeriksa syarat awal KIP Kuliah 2026.',
  },
];

export const GROUP_OPTIONS: GroupOption[] = [
  { value: 'calon-mahasiswa', label: 'Calon mahasiswa' },
  { value: 'peserta-didik', label: 'Peserta didik' },
  { value: 'pencari-kerja', label: 'Pencari kerja' },
  { value: 'pekerja', label: 'Pekerja' },
  { value: 'keluarga', label: 'Keluarga' },
  { value: 'penduduk', label: 'Penduduk' },
  { value: 'pelaku-usaha', label: 'Pelaku usaha' },
];

export const AGE_OPTIONS: AgeOption[] = [
  { value: 'di-bawah-18', label: 'Di bawah 18 tahun' },
  { value: '18-24', label: '18–24 tahun' },
  { value: '25-59', label: '25–59 tahun' },
  { value: '60-ke-atas', label: '60 tahun atau lebih' },
];

export const GRADUATION_OPTIONS: ConditionOption[] = [
  { value: '2026', label: '2026' },
  { value: '2025', label: '2025' },
  { value: '2024', label: '2024' },
  { value: 'lain', label: 'Tahun lain atau belum tahu' },
];
