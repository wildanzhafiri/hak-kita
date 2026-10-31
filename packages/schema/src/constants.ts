export const KODE_NASIONAL = 'ID';

export const LEVEL_WILAYAH = ['nasional', 'provinsi', 'kabkota'] as const;

export const KATEGORI = [
  'Pendidikan',
  'Beasiswa',
  'Kesehatan',
  'Bantuan Sosial',
  'Pangan & Gizi',
  'Pekerjaan & Pelatihan',
  'Usaha & UMKM',
  'Perumahan',
  'Pertanian & Perikanan',
  'Layanan Administrasi',
] as const;

export const TIPE_GERBANG = ['desil', 'kategori', 'prosedur'] as const;

export const JENIS_SUMBER = ['peraturan', 'situs-resmi', 'portal-data', 'bank-penyalur'] as const;

export const TINGKAT_VERIFIKASI = ['lengkap', 'dasar', 'belum'] as const;

export const PROFILE_GROUPS = [
  'calon-mahasiswa',
  'peserta-didik',
  'pencari-kerja',
  'pekerja',
  'keluarga',
  'penduduk',
  'pelaku-usaha',
] as const;

export const AGE_BANDS = ['di-bawah-18', '18-24', '25-59', '60-ke-atas'] as const;
