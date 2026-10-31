import type { z } from 'zod';
import type {
  AGE_BANDS,
  JENIS_SUMBER,
  KATEGORI,
  LEVEL_WILAYAH,
  PROFILE_GROUPS,
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
import type { ProfileSchema } from './profile.schema';
import type { WilayahFileSchema, WilayahSchema } from './wilayah.schema';

export type LevelWilayah = (typeof LEVEL_WILAYAH)[number];
export type Kategori = (typeof KATEGORI)[number];
export type TipeGerbang = (typeof TIPE_GERBANG)[number];
export type JenisSumber = (typeof JENIS_SUMBER)[number];
export type TingkatVerifikasi = (typeof TINGKAT_VERIFIKASI)[number];

export type Syarat = z.infer<typeof SyaratSchema>;
export type Periode = z.infer<typeof PeriodeSchema>;
export type SumberUtama = z.infer<typeof SumberUtamaSchema>;
export type Cakupan = z.infer<typeof CakupanSchema>;
export type Program = z.infer<typeof ProgramSchema>;
export type Kriteria = z.infer<typeof KriteriaSchema>;
export type Profile = z.infer<typeof ProfileSchema>;
export type ProfileGroup = (typeof PROFILE_GROUPS)[number];
export type AgeBand = (typeof AGE_BANDS)[number];

export type Wilayah = z.infer<typeof WilayahSchema>;
export type WilayahFile = z.infer<typeof WilayahFileSchema>;

export type BerkasPilihan = z.infer<typeof BerkasPilihanSchema>;
export type BerkasPertanyaan = z.infer<typeof BerkasPertanyaanSchema>;
export type BerkasKondisi = z.infer<typeof BerkasKondisiSchema>;
export type BerkasDokumen = z.infer<typeof BerkasDokumenSchema>;
export type BerkasKendala = z.infer<typeof BerkasKendalaSchema>;
export type Berkas = z.infer<typeof BerkasSchema>;
