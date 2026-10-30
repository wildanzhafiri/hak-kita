import { z } from 'zod';

const SlugSchema = z
  .string()
  .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'huruf kecil, angka, dan tanda hubung');

export const BerkasPilihanSchema = z.object({
  nilai: SlugSchema,
  label: z.string().min(3),
});

export const BerkasPertanyaanSchema = z.object({
  id: SlugSchema,
  teks: z.string().min(5),
  pilihan: z.array(BerkasPilihanSchema).min(2),
});

export const BerkasKondisiSchema = z.object({
  pertanyaan: SlugSchema,
  nilai: z.array(SlugSchema).min(1),
});

export const BerkasDokumenSchema = z.object({
  id: SlugSchema,
  label: z.string().min(3),
  catatan: z.string().optional(),
  kondisi: BerkasKondisiSchema.optional(),
  sumberUrl: z.url(),
});

export const BerkasKendalaSchema = z.object({
  masalah: z.string().min(5),
  langkah: z.string().min(5),
  sumberUrl: z.url(),
});

export const BerkasSchema = z
  .object({
    pertanyaan: z.array(BerkasPertanyaanSchema).default([]),
    dokumen: z.array(BerkasDokumenSchema).min(1),
    kendala: z.array(BerkasKendalaSchema).default([]),
  })
  .superRefine((berkas, ctx) => {
    const ids = new Set<string>();
    berkas.dokumen.forEach((dokumen, i) => {
      if (ids.has(dokumen.id)) {
        ctx.addIssue({
          code: 'custom',
          path: ['dokumen', i, 'id'],
          message: `id dokumen ganda: ${dokumen.id}`,
        });
      }
      ids.add(dokumen.id);

      if (!dokumen.kondisi) return;
      const pertanyaan = berkas.pertanyaan.find((p) => p.id === dokumen.kondisi?.pertanyaan);
      if (!pertanyaan) {
        ctx.addIssue({
          code: 'custom',
          path: ['dokumen', i, 'kondisi', 'pertanyaan'],
          message: `pertanyaan "${dokumen.kondisi.pertanyaan}" tidak ditemukan`,
        });
        return;
      }
      const allowed = new Set(pertanyaan.pilihan.map((p) => p.nilai));
      dokumen.kondisi.nilai.forEach((nilai, j) => {
        if (!allowed.has(nilai)) {
          ctx.addIssue({
            code: 'custom',
            path: ['dokumen', i, 'kondisi', 'nilai', j],
            message: `nilai "${nilai}" bukan pilihan dari pertanyaan "${pertanyaan.id}"`,
          });
        }
      });
    });
  });
