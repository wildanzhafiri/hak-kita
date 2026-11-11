import type {
  AktivitasProfil,
  Jenjang,
  JenjangPendidikanProfil,
  Kategori,
  ProfileGroup,
} from '@hakkita/schema';

export const KODE_NASIONAL = 'ID';

export const STALE_AFTER_DAYS = 90;

export const KATEGORI_LAYANAN: Kategori = 'Layanan Administrasi';

export const OFFICIAL_DOMAINS = ['go.id', 'desa.id'] as const;

export const MS_PER_DAY = 86_400_000;

export const MONTH_NAMES = [
  'Januari',
  'Februari',
  'Maret',
  'April',
  'Mei',
  'Juni',
  'Juli',
  'Agustus',
  'September',
  'Oktober',
  'November',
  'Desember',
] as const;

export const BERKAS_NOTE_MAX_LENGTH = 500;

export const DEFAULT_STEPS = [
  'Periksa informasi terbaru melalui kanal resmi.',
  'Siapkan dokumen sesuai ketentuan penyelenggara.',
  'Ikuti alur pengajuan melalui kanal resmi.',
  'Simpan bukti pengurusan dari penyelenggara, jika tersedia.',
] as const;

export const RANK_STOP_WORDS = new Set([
  'apa',
  'atau',
  'aku',
  'saya',
  'bagaimana',
  'gimana',
  'bisa',
  'buat',
  'bikin',
  'cara',
  'dan',
  'dari',
  'dengan',
  'di',
  'dong',
  'ini',
  'itu',
  'ke',
  'mau',
  'ingin',
  'minta',
  'pada',
  'tolong',
  'untuk',
  'yang',
  'ya',
  'kah',
  'lah',
  'nih',
  'sih',
  'mengurus',
  'urus',
  'pengurusan',
  'tahu',
  'kasih',
  'ada',
  'langkah',
  'syarat',
  'persyaratan',
  'berkas',
  'dokumen',
  'prosedur',
  'tahap',
  'tahapan',
]);
export const RANK_MIN_PREFIX_LENGTH = 5;
export const RANK_NAME_WEIGHT = 5;
export const RANK_ALIAS_WEIGHT = 4;
export const RANK_CATEGORY_WEIGHT = 2;
export const RANK_TEXT_WEIGHT = 1;
export const RANK_RELATIVE_THRESHOLD = 0.5;

export const ACTIVITY_GROUPS: Record<AktivitasProfil, readonly ProfileGroup[]> = {
  pelajar: ['peserta-didik'],
  mahasiswa: ['peserta-didik'],
  bekerja: ['pekerja'],
  'mencari-kerja': ['pencari-kerja'],
  usaha: ['pelaku-usaha'],
  lainnya: [],
};

export const SCHOOL_LEAVER_EDUCATION: JenjangPendidikanProfil = 'sma';

export const EDUCATION_LEVELS: Record<JenjangPendidikanProfil, readonly Jenjang[]> = {
  sd: ['SD/Sederajat'],
  smp: ['SMP/Sederajat'],
  sma: ['SMA/SMK/Sederajat'],
  diploma: ['Diploma'],
  sarjana: ['S1'],
  pascasarjana: ['S2', 'S3'],
};

export const RECOMMENDATION_INTEREST_WEIGHT = 3;
export const RECOMMENDATION_GROUP_WEIGHT = 2;
export const RECOMMENDATION_LEVEL_WEIGHT = 1;
export const RECOMMENDATION_LOCAL_WEIGHT = 1;
export const RECOMMENDATION_CLOSED_PENALTY = 2;

export const AUDIENCE_RULES = [
  { label: 'Mahasiswa', pattern: /mahasiswa/i },
  { label: 'Lulusan Baru', pattern: /lulusan/i },
  { label: 'Pelajar', pattern: /peserta didik|siswa|pelajar/i },
  { label: 'Pencari Kerja', pattern: /pencari kerja|mencari kerja|ingin bekerja/i },
  { label: 'Pekerja', pattern: /pekerja|tenaga kerja|karyawan|buruh/i },
  { label: 'Pelaku UMKM', pattern: /usaha|bisnis|umkm|wirausaha/i },
  { label: 'Petani', pattern: /petani|nelayan|pertanian/i },
  { label: 'Lansia', pattern: /lansia|lanjut usia/i },
  { label: 'Penyandang Disabilitas', pattern: /disabilitas/i },
  {
    label: 'Keluarga',
    pattern: /keluarga|orang tua|wali|penghasilan rendah|desil|miskin/i,
  },
] as const;

export const AUDIENCE_DEFAULT = 'Masyarakat Umum';

export const AUDIENCE_OPTIONS: readonly string[] = [
  'Pelajar',
  'Mahasiswa',
  'Lulusan Baru',
  'Pencari Kerja',
  'Pekerja',
  'Keluarga',
  'Pelaku UMKM',
  'Petani',
  'Lansia',
  'Penyandang Disabilitas',
  AUDIENCE_DEFAULT,
];
