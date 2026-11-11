export const KODE_NASIONAL = 'ID';

export const LEVEL_WILAYAH = ['nasional', 'provinsi', 'kabkota'] as const;

export const KATEGORI_PROGRAM = [
  'Pendidikan',
  'Beasiswa',
  'Kesehatan',
  'Bantuan Sosial',
  'Pangan & Gizi',
  'Pekerjaan & Pelatihan',
  'Usaha & UMKM',
  'Perumahan',
  'Pertanian & Perikanan',
] as const;

export const KATEGORI_LAYANAN = [
  'Kependudukan & Dokumen Pribadi',
  'Kendaraan & Transportasi',
  'Kesehatan & Jaminan Sosial',
  'Pekerjaan & Usaha',
  'Perpajakan',
  'Pendidikan & Dokumen Akademik',
  'Pertanahan & Bangunan',
  'Pengaduan & Informasi Publik',
] as const;

export const KATEGORI = [...KATEGORI_PROGRAM, ...KATEGORI_LAYANAN, 'Layanan Administrasi'] as const;

export const MANFAAT = [
  'Bantuan Biaya Pendidikan',
  'Bantuan Sosial',
  'Pelatihan & Pengembangan Keterampilan',
  'Kesempatan Kerja & Pemagangan',
  'Pembiayaan & Kredit',
  'Subsidi',
  'Layanan & Pendampingan',
] as const;

export const JENJANG = [
  'SD/Sederajat',
  'SMP/Sederajat',
  'SMA/SMK/Sederajat',
  'Diploma',
  'S1',
  'S2',
  'S3',
] as const;

export const KANAL_LAYANAN = ['online', 'offline'] as const;

export const TIPE_GERBANG =['desil', 'kategori', 'prosedur'] as const;

export const JENIS_SUMBER = ['peraturan', 'situs-resmi', 'portal-data', 'bank-penyalur'] as const;

export const TINGKAT_VERIFIKASI = ['lengkap', 'dasar', 'belum'] as const;

export const JENIS_PROGRAM = ['program', 'layanan'] as const;

export const LEGACY_SERVICE_CATEGORY_BY_ID: Record<string, (typeof KATEGORI_LAYANAN)[number]> = {
  'akta-kelahiran': 'Kependudukan & Dokumen Pribadi',
  'kartu-keluarga': 'Kependudukan & Dokumen Pribadi',
  'ktp-el': 'Kependudukan & Dokumen Pribadi',
  npwp: 'Perpajakan',
  'paspor-baru': 'Kependudukan & Dokumen Pribadi',
  'pendaftaran-jkn': 'Kesehatan & Jaminan Sosial',
  'perpanjangan-sim': 'Kendaraan & Transportasi',
  'sim-baru': 'Kendaraan & Transportasi',
};

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

export const OBSTACLE_REPORT_STAGES = [
  'mencari-informasi',
  'memenuhi-persyaratan',
  'menyiapkan-berkas',
  'mengajukan',
  'menunggu-verifikasi',
  'mengikuti-seleksi',
  'menerima-hasil',
] as const;
export const RADAR_RUN_KINDS = ['discovery', 'monitoring'] as const;

export const RADAR_SKIP_REASONS = [
  'no-pages',
  'search-repeated',
  'ai-not-configured',
  'insufficient-evidence',
  'unknown-region',
  'already-listed',
  'already-queued',
  'error',
] as const;

export const RADAR_SOURCE_OUTCOMES = ['unchanged', 'changed', 'baseline', 'failed'] as const;

export const MAX_ASSISTANT_MESSAGE_COUNT = 12;
export const MAX_ASSISTANT_USER_TEXT_LENGTH = 2_000;
