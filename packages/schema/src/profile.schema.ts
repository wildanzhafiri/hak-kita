import { z } from 'zod';
import {
  AKTIVITAS_LAIN_MAKS,
  AKTIVITAS_PROFIL,
  JENJANG_PENDIDIKAN_PROFIL,
  KATEGORI_PROGRAM,
  NAMA_PROFIL_MAKS,
} from './constants';

export const PreferensiProfilSchema = z.object({
  provinsi: z
    .string()
    .regex(/^\d{2}$/, 'Kode provinsi harus 2 digit')
    .nullable(),
  kota: z
    .string()
    .regex(/^\d{4}$/, 'Kode kabupaten/kota harus 4 digit')
    .nullable(),
  kegiatan: z.array(z.enum(AKTIVITAS_PROFIL)),
  kegiatanLain: z.string().trim().max(AKTIVITAS_LAIN_MAKS),
  pendidikan: z.enum(JENJANG_PENDIDIKAN_PROFIL).nullable(),
  minat: z.array(z.enum(KATEGORI_PROGRAM)),
});

export const ProfilPenggunaSchema = z.object({
  nama: z.string().trim().max(NAMA_PROFIL_MAKS),
  preferensi: PreferensiProfilSchema,
});
