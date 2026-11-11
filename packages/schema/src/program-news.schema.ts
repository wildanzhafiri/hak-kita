import { z } from 'zod';

export const ProgramNewsInputSchema = z.object({
  title: z.string().trim().min(8).max(180),
  summary: z.string().trim().min(20).max(600),
  sourceUrl: z
    .url()
    .regex(/^https:\/\/([a-z0-9-]+\.)*go\.id(\/|\?|#|$)/i, 'Tautan harus berdomain go.id'),
  publishedOn: z.iso.date(),
});

export const ProgramNewsRequestSchema = ProgramNewsInputSchema.extend({
  action: z.enum(['preview', 'send']),
});

export const ProgramEmailRequestSchema = z.object({
  action: z.enum(['preview', 'send']),
  note: z.string().trim().max(600).optional(),
});

export type ProgramNewsInput = z.infer<typeof ProgramNewsInputSchema>;
