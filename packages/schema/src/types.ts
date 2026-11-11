import type { z } from 'zod';
import type {
  AKTIVITAS_PROFIL,
  JENJANG_PENDIDIKAN_PROFIL,
  JENIS_SUMBER,
  JENIS_PROGRAM,
  KATEGORI_LAYANAN,
  KATEGORI_PROGRAM,
  JENJANG,
  KANAL_LAYANAN,
  KATEGORI,
  MANFAAT,
  LEVEL_WILAYAH,
  OBSTACLE_REPORT_STAGES,
  PROFILE_GROUPS,
  RADAR_RUN_KINDS,
  RADAR_SKIP_REASONS,
  RADAR_SOURCE_OUTCOMES,
  TINGKAT_VERIFIKASI,
  TIPE_GERBANG,
} from './constants';
import type {
  BerkasDokumenSchema,
  BerkasKendalaSchema,
  BerkasKondisiSchema,
  BerkasPertanyaanSchema,
  BerkasPilihanSchema,
  BerkasSchema,
} from './berkas.schema';
import type {
  CakupanSchema,
  KriteriaSchema,
  PeriodeSchema,
  ProgramSchema,
  SumberUtamaSchema,
  SyaratSchema,
} from './program.schema';
import type { PreferensiProfilSchema, ProfilPenggunaSchema } from './profile.schema';
import type {
  RadarDraftSchema,
  RadarProgramDraftSchema,
  RadarProgramReviewRequestSchema,
  RadarRunEventSchema,
  RadarSearchResponseSchema,
  RadarReviewRequestSchema,
} from './radar.schema';
import type { KnowledgeDocumentSchema } from './knowledge.schema';
import type { WilayahFileSchema, WilayahSchema } from './wilayah.schema';

export type LevelWilayah = (typeof LEVEL_WILAYAH)[number];
export type Kategori = (typeof KATEGORI)[number];
export type KategoriProgram = (typeof KATEGORI_PROGRAM)[number];
export type KategoriLayanan = (typeof KATEGORI_LAYANAN)[number];
export type Manfaat = (typeof MANFAAT)[number];
export type Jenjang = (typeof JENJANG)[number];
export type KanalLayanan = (typeof KANAL_LAYANAN)[number];
export type TipeGerbang = (typeof TIPE_GERBANG)[number];
export type JenisSumber = (typeof JENIS_SUMBER)[number];
export type JenisProgram = (typeof JENIS_PROGRAM)[number];
export type TingkatVerifikasi = (typeof TINGKAT_VERIFIKASI)[number];

export type Syarat = z.infer<typeof SyaratSchema>;
export type Periode = z.infer<typeof PeriodeSchema>;
export type SumberUtama = z.infer<typeof SumberUtamaSchema>;
export type SumberTambahan = SumberUtama;
export type Cakupan = z.infer<typeof CakupanSchema>;
export type Program = z.infer<typeof ProgramSchema>;
export type Kriteria = z.infer<typeof KriteriaSchema>;
export type PreferensiProfil = z.infer<typeof PreferensiProfilSchema>;
export type ProfilPengguna = z.infer<typeof ProfilPenggunaSchema>;
export type AktivitasProfil = (typeof AKTIVITAS_PROFIL)[number];
export type JenjangPendidikanProfil = (typeof JENJANG_PENDIDIKAN_PROFIL)[number];
export type KnowledgeDocument = z.infer<typeof KnowledgeDocumentSchema>;
export type RadarDraft = z.infer<typeof RadarDraftSchema>;
export type RadarProgramDraft = z.infer<typeof RadarProgramDraftSchema>;
export type RadarProgramReviewRequest = z.infer<typeof RadarProgramReviewRequestSchema>;
export type RadarSearchResponse = z.infer<typeof RadarSearchResponseSchema>;
export type RadarReviewRequest = z.infer<typeof RadarReviewRequestSchema>;
export type RadarRunEvent = z.infer<typeof RadarRunEventSchema>;
export type RadarRunKind = (typeof RADAR_RUN_KINDS)[number];
export type RadarSkipReason = (typeof RADAR_SKIP_REASONS)[number];
export type RadarSourceOutcome = (typeof RADAR_SOURCE_OUTCOMES)[number];
export type ProfileGroup = (typeof PROFILE_GROUPS)[number];
export type ObstacleReportStage = (typeof OBSTACLE_REPORT_STAGES)[number];

export type Wilayah = z.infer<typeof WilayahSchema>;
export type WilayahFile = z.infer<typeof WilayahFileSchema>;

export type BerkasPilihan = z.infer<typeof BerkasPilihanSchema>;
export type BerkasPertanyaan = z.infer<typeof BerkasPertanyaanSchema>;
export type BerkasKondisi = z.infer<typeof BerkasKondisiSchema>;
export type BerkasDokumen = z.infer<typeof BerkasDokumenSchema>;
export type BerkasKendala = z.infer<typeof BerkasKendalaSchema>;
export type Berkas = z.infer<typeof BerkasSchema>;
