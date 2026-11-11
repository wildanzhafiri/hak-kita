import { z } from 'zod';
import { MAX_ASSISTANT_MESSAGE_COUNT } from './constants';

const ProgramIdSchema = z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/);

export const AssistantRequestSchema = z.object({
  messages: z
    .array(
      z
        .object({
          id: z.string().min(1).max(200),
          role: z.enum(['user', 'assistant']),
          parts: z.array(z.unknown()).max(30),
        })
        .passthrough(),
    )
    .min(1)
    .max(MAX_ASSISTANT_MESSAGE_COUNT),
  currentPath: z
    .string()
    .max(180)
    .regex(/^\/[a-z0-9/-]*$/)
    .optional(),
  turnstileToken: z.string().min(1).max(2048).optional(),
});

export const AssistantCatalogQuerySchema = z.object({
  query: z.string().trim().min(2).max(160),
});

export const AssistantPageReadQuerySchema = z.object({
  url: z.string().trim().url().max(500),
});

export const AssistantNewsQuerySchema = z.object({ programId: ProgramIdSchema.optional() });

export const AssistantBudgetQuerySchema = z.object({ year: z.literal(2026) });

export const AssistantPlanQuerySchema = z.object({});

export const AssistantPageQuerySchema = z.object({
  page: z.enum([
    'beranda',
    'program',
    'layanan',
    'anggaran',
    'rencanaku',
    'rekomendasi',
    'bantuan',
  ]),
});

export const AssistantSaveProgramQuerySchema = z.object({ programId: ProgramIdSchema });
