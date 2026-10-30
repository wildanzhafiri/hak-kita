import type { TipeGerbang } from '@hakkita/schema';

export const DETAIL_TABS = ['Ringkasan', 'Persyaratan', 'Langkah berikutnya'] as const;

export const DEFAULT_SEARCH_PLACEHOLDER = 'Cari program atau layanan...';

export const GERBANG_LABEL: Record<TipeGerbang, string> = {
  desil: 'Ditetapkan lewat data pemerintah (desil)',
  kategori: 'Syarat kategori umum',
  prosedur: 'Prosedur administrasi tanpa seleksi',
};

export const DEFAULT_STEPS = [
  'Periksa informasi terbaru melalui kanal resmi.',
  'Siapkan dokumen sesuai ketentuan penyelenggara.',
  'Ikuti alur pengajuan melalui kanal resmi.',
  'Simpan bukti pengurusan dari penyelenggara, jika tersedia.',
] as const;
