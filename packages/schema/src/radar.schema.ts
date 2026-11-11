import { z } from 'zod';
import { RADAR_RUN_KINDS, RADAR_SKIP_REASONS, RADAR_SOURCE_OUTCOMES } from './constants';
import { ProgramSchema } from './program.schema';

const RunRoundSchema = z.number().int().nonnegative();

export const RadarRunEventSchema = z.discriminatedUnion('type', [
  z.object({
    type: z.literal('started'),
    run: z.enum(RADAR_RUN_KINDS),
    total: z.number().int().nonnegative(),
  }),
  z.object({
    type: z.literal('round'),
    index: RunRoundSchema,
    total: z.number().int().positive(),
    label: z.string(),
  }),
  z.object({
    type: z.literal('searched'),
    index: RunRoundSchema,
    found: z.number().int().nonnegative(),
    usedRegisteredSources: z.boolean(),
  }),
  z.object({
    type: z.literal('read'),
    index: RunRoundSchema,
    readable: z.number().int().nonnegative(),
  }),
  z.object({ type: z.literal('drafting'), index: RunRoundSchema }),
  z.object({ type: z.literal('source-opened'), host: z.string() }),
  z.object({ type: z.literal('checking'), index: RunRoundSchema }),
  z.object({
    type: z.literal('outcome'),
    index: RunRoundSchema,
    result: z.enum(['queued', 'skipped']),
    name: z.string().nullable(),
    reason: z.enum(RADAR_SKIP_REASONS).nullable(),
    detail: z.string().optional(),
  }),
  z.object({
    type: z.literal('source-checked'),
    host: z.string(),
    outcome: z.enum(RADAR_SOURCE_OUTCOMES),
    checked: z.number().int().nonnegative(),
    total: z.number().int().positive(),
  }),
  z.object({ type: z.literal('finished'), summary: z.string() }),
  z.object({ type: z.literal('failed'), message: z.string() }),
]);

const RadarSourceUrlsSchema = z.array(z.url().startsWith('https://')).max(10);

export const RadarReviewRequestSchema = z.discriminatedUnion('action', [
  z.object({
    action: z.literal('reject'),
    candidateId: z.uuid(),
  }),
  z.object({
    action: z.literal('approve'),
    candidateId: z.uuid(),
    title: z.string().trim().min(8).max(180),
    summary: z.string().trim().min(20).max(600),
    publishedOn: z.iso.date(),
    emailText: z.string().trim().min(20).max(1200),
    extraSourceUrls: RadarSourceUrlsSchema,
    sourceConfirmed: z.literal(true),
  }),
]);

export const RadarDraftSchema = z.object({
  isRelevant: z.boolean(),
  title: z.string().trim().min(8).max(180).nullable(),
  summary: z.string().trim().min(20).max(600).nullable(),
  emailText: z.string().trim().min(20).max(1200).nullable(),
  publishedOn: z.iso.date().nullable(),
  evidenceQuote: z.string().trim().min(20).max(2000).nullable(),
});

export const RadarProgramDraftSchema = z.object({
  program: ProgramSchema,
  evidence: z
    .array(
      z.object({
        url: z.url().startsWith('https://'),
        quote: z.string().trim().min(20).max(2000),
      }),
    )
    .min(2)
    .max(10),
});

export const RadarProgramReviewRequestSchema = z.discriminatedUnion('action', [
  z.object({ action: z.literal('reject'), candidateId: z.uuid() }),
  z.object({
    action: z.literal('approve'),
    candidateId: z.uuid(),
    program: ProgramSchema,
  }),
]);

export const RadarSearchResponseSchema = z.object({
  results: z.array(z.object({ url: z.url(), title: z.string(), content: z.string() })).max(20),
});

export const RadarExtractResponseSchema = z.object({
  results: z
    .array(z.object({ url: z.url(), raw_content: z.string().nullable().optional() }))
    .max(20),
});

export const RadarAdminControlSchema = z.discriminatedUnion('action', [
  z.object({ action: z.literal('automatic_discovery'), enabled: z.boolean() }),
  z.object({ action: z.literal('monitoring'), enabled: z.boolean() }),
  z.object({ action: z.literal('run_discovery') }),
  z.object({ action: z.literal('run_monitoring') }),
]);

export const RadarEmailSendSchema = z.object({ newsId: z.uuid() });
