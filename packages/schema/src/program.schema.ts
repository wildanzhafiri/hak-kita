import { z } from 'zod';
import {
  KATEGORI_LAYANAN,
  KATEGORI_PROGRAM,
  LEGACY_SERVICE_CATEGORY_BY_ID,
  JENIS_PROGRAM,
  JENIS_SUMBER,
  JENJANG,
  KANAL_LAYANAN,
  KATEGORI,
  MANFAAT,
  PROFILE_GROUPS,
  TINGKAT_VERIFIKASI,
  TIPE_GERBANG,
} from './constants';
import { BerkasSchema } from './berkas.schema';
import { KodeWilayahSchema, LevelWilayahSchema, matchesLevel } from './wilayah.schema';

export const TanggalSchema = z
  .string()
  .regex(/^\d{4}-\d{2}-\d{2}$/, 'Format tanggal harus YYYY-MM-DD');

export const SyaratSchema = z.object({
  teks: z.string().min(3),
  sumberUrl: z.url().optional(),
  kutipan: z.string().optional(),
});

export const PeriodeSchema = z.union([
  z.literal('sepanjang-tahun'),
  z.object({ buka: TanggalSchema, tutup: TanggalSchema }),
]);

export const SumberUtamaSchema = z.object({
  url: z.url(),
  jenis: z.enum(JENIS_SUMBER),
  dasarHukum: z.string().optional(),
  kutipan: z.string().optional(),
});

export const CakupanSchema = z.object({
  level: LevelWilayahSchema,
  kode: KodeWilayahSchema,
});

export const KriteriaSchema = z
  .object({
    kelompok: z.array(z.enum(PROFILE_GROUPS)).min(1),
    usiaMinimum: z.number().int().min(0).optional(),
    usiaMaksimum: z.number().int().min(0).optional(),
    tahunLulus: z.array(z.number().int()).min(1).optional(),
    syaratIndex: z.number().int().nonnegative(),
  })
  .refine(
    (kriteria) =>
      kriteria.usiaMinimum === undefined ||
      kriteria.usiaMaksimum === undefined ||
      kriteria.usiaMinimum <= kriteria.usiaMaksimum,
    'usiaMinimum tidak boleh melebihi usiaMaksimum',
  );

export const ProgramSchema = z
  .object({
    id: z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'id: huruf kecil, angka, dan tanda hubung'),
    nama: z.string().min(2),
    jenis: z.enum(JENIS_PROGRAM).optional(),
    kategori: z.enum(KATEGORI),
    penyelenggara: z.string().min(2),
    ringkasan: z.string().min(10),
    untuk: z.array(z.string().min(2)).min(1),
    manfaat: z.array(z.enum(MANFAAT)).optional(),
    jenjang: z.array(z.enum(JENJANG)).optional(),
    kanal: z.array(z.enum(KANAL_LAYANAN)).min(1).optional(),
    biaya: z.string().min(3).optional(),
    tentang: z.string().min(10).optional(),
    alias: z.array(z.string().min(2)).optional(),
    terkait: z
      .array(z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/))
      .max(6)
      .optional(),
    cakupan: CakupanSchema,
    tipeGerbang: z.enum(TIPE_GERBANG),
    syarat: z.array(SyaratSchema).min(1),
    kriteria: z.array(KriteriaSchema).min(1).optional(),
    langkah: z.array(z.string().min(3)).default([]),
    dokumen: z.array(z.string().min(2)).default([]),
    periode: PeriodeSchema.optional(),
    sumberUtama: SumberUtamaSchema,
    sumberTambahan: z.array(SumberUtamaSchema).max(10).default([]),
    verifikasi: z.enum(TINGKAT_VERIFIKASI),
    tanggalDiperiksa: TanggalSchema.optional(),
    catatan: z.string().optional(),
    berkas: BerkasSchema.optional(),
  })
  .superRefine((p, ctx) => {
    const jenis = p.jenis ?? (p.kategori === 'Layanan Administrasi' ? 'layanan' : 'program');
    if (jenis === 'program' && !(KATEGORI_PROGRAM as readonly string[]).includes(p.kategori)) {
      ctx.addIssue({
        code: 'custom',
        path: ['kategori'],
        message: 'Kategori harus sesuai dengan jenis program',
      });
    }
    if (
      jenis === 'layanan' &&
      p.kategori !== 'Layanan Administrasi' &&
      !(KATEGORI_LAYANAN as readonly string[]).includes(p.kategori)
    ) {
      ctx.addIssue({
        code: 'custom',
        path: ['kategori'],
        message: 'Kategori harus sesuai dengan jenis layanan',
      });
    }
    const sourceUrls = [p.sumberUtama.url, ...p.sumberTambahan.map((source) => source.url)];
    if (new Set(sourceUrls).size !== sourceUrls.length) {
      ctx.addIssue({
        code: 'custom',
        path: ['sumberTambahan'],
        message: 'Setiap sumber harus memiliki tautan yang berbeda',
      });
    }
    if (!matchesLevel(p.cakupan.level, p.cakupan.kode)) {
      ctx.addIssue({
        code: 'custom',
        path: ['cakupan', 'kode'],
        message: `Kode "${p.cakupan.kode}" tidak sesuai level "${p.cakupan.level}"`,
      });
    }
    if (p.verifikasi !== 'belum' && !p.tanggalDiperiksa) {
      ctx.addIssue({
        code: 'custom',
        path: ['tanggalDiperiksa'],
        message: 'tanggalDiperiksa wajib diisi jika verifikasi bukan "belum"',
      });
    }
    if (p.verifikasi === 'lengkap') {
      p.syarat.forEach((s, i) => {
        if (!s.sumberUrl) {
          ctx.addIssue({
            code: 'custom',
            path: ['syarat', i, 'sumberUrl'],
            message: 'Verifikasi "lengkap" mewajibkan sumberUrl pada setiap syarat',
          });
        }
      });
    }
    p.kriteria?.forEach((kriteria, index) => {
      if (!p.syarat[kriteria.syaratIndex]?.sumberUrl) {
        ctx.addIssue({
          code: 'custom',
          path: ['kriteria', index, 'syaratIndex'],
          message: 'Kriteria harus merujuk syarat dengan sumber resmi',
        });
      }
    });
    if (typeof p.periode === 'object' && p.periode.buka > p.periode.tutup) {
      ctx.addIssue({
        code: 'custom',
        path: ['periode'],
        message: 'periode.buka tidak boleh setelah periode.tutup',
      });
    }
  })
  .transform((program) => ({
    ...program,
    jenis: program.jenis ?? (program.kategori === 'Layanan Administrasi' ? 'layanan' : 'program'),
    kategori:
      program.kategori === 'Layanan Administrasi'
        ? (LEGACY_SERVICE_CATEGORY_BY_ID[program.id] ?? program.kategori)
        : program.kategori,
  }));
