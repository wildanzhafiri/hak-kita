import { z } from 'zod';
import { AGE_BANDS, PROFILE_GROUPS } from './constants';

export const ProfileSchema = z.object({
  kelompok: z.enum(PROFILE_GROUPS).nullable(),
  rentangUsia: z.enum(AGE_BANDS).nullable(),
  wilayah: z.string().nullable(),
  tahunLulus: z.union([z.number().int(), z.literal('lain')]).nullable(),
});
