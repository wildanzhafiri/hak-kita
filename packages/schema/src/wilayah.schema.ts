import { z } from 'zod';
import { KODE_NASIONAL, LEVEL_WILAYAH } from './constants';
import type { LevelWilayah } from './types';

export const LevelWilayahSchema = z.enum(LEVEL_WILAYAH);

export const KodeWilayahSchema = z
  .string()
  .regex(/^(ID|\d{2}|\d{4})$/, 'Kode wilayah harus "ID", 2 digit, atau 4 digit');

export function matchesLevel(level: LevelWilayah, kode: string): boolean {
  if (level === 'nasional') return kode === KODE_NASIONAL;
  if (level === 'provinsi') return /^\d{2}$/.test(kode);
  return /^\d{4}$/.test(kode);
}

function expectedParent(level: LevelWilayah, kode: string): string | null {
  if (level === 'nasional') return null;
  if (level === 'provinsi') return KODE_NASIONAL;
  return kode.slice(0, 2);
}

export const WilayahSchema = z
  .object({
    kode: KodeWilayahSchema,
    nama: z.string().min(1),
    level: LevelWilayahSchema,
    parent: KodeWilayahSchema.nullable(),
  })
  .superRefine((w, ctx) => {
    if (!matchesLevel(w.level, w.kode)) {
      ctx.addIssue({
        code: 'custom',
        path: ['kode'],
        message: `Kode "${w.kode}" tidak sesuai level "${w.level}"`,
      });
    }
    const parent = expectedParent(w.level, w.kode);
    if (w.parent !== parent) {
      ctx.addIssue({
        code: 'custom',
        path: ['parent'],
        message: `Parent untuk "${w.kode}" seharusnya ${parent === null ? 'null' : `"${parent}"`}`,
      });
    }
  });

export const WilayahFileSchema = z.object({
  versiKode: z.string().min(1),
  sumber: z.url(),
  catatan: z.string().optional(),
  wilayah: z.array(WilayahSchema).min(1),
});
