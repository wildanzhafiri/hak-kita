import type { TingkatVerifikasi } from '@hakkita/schema';

export const VERIFIKASI_MEANING: Record<TingkatVerifikasi, string> = {
  lengkap:
    'Setiap syarat sudah dibandingkan dengan sumber resmi dan punya tautan sumbernya sendiri.',
  dasar: 'Identitas program, periode, dan tautan resmi sudah diperiksa.',
  belum: 'Kandidat yang ditemukan dari penelusuran, belum dicek ke sumber resmi.',
};

export const SOURCE_RULES: readonly { type: string; role: string }[] = [
  {
    type: 'Peraturan resmi dan situs penyelenggara berdomain .go.id',
    role: 'Dipakai sebagai sumber utama',
  },
  {
    type: 'Portal data terbuka pemerintah daerah; bank penyalur resmi (khusus KUR)',
    role: 'Dipakai dengan label',
  },
  {
    type: 'Berita media',
    role: 'Hanya untuk menemukan kandidat, tidak pernah jadi sumber utama',
  },
  { type: 'Blog dan situs komersial', role: 'Tidak dipakai' },
];
