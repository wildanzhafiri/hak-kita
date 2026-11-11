import 'server-only';
import { randomUUID } from 'node:crypto';
import { ProgramSchema } from '@hakkita/schema';
import type { Program, ProgramNewsInput } from '@hakkita/schema';
import { buildProgramNewsEmail, createProgramNewsEmailId } from './program-news';
import {
  countEligibleFollowers,
  createDeliveryClient,
  sendApprovedProgramNewsNow,
} from './program-news-delivery';
import type { ProgramNews } from './types';

const POSTGRES_UNIQUE_VIOLATION = '23505';

export class DuplicateProgramNewsError extends Error {}

async function loadPublishedProgram(
  client: ReturnType<typeof createDeliveryClient>,
  programId: string,
): Promise<Program> {
  const { data, error } = await client
    .from('programs')
    .select('record')
    .eq('id', programId)
    .single();
  if (error) throw error;
  const parsed = ProgramSchema.safeParse(data.record);
  if (!parsed.success || parsed.data.id !== programId) {
    throw new Error('Informasi program tidak valid');
  }
  return parsed.data;
}

function toNewsRow(programId: string, input: ProgramNewsInput): ProgramNews {
  return {
    id: randomUUID(),
    program_id: programId,
    title: input.title,
    summary: input.summary,
    source_url: input.sourceUrl,
    published_on: input.publishedOn,
    created_at: new Date().toISOString(),
    email_text: null,
    extra_source_urls: [],
  };
}

export async function previewManualProgramNews(programId: string, input: ProgramNewsInput) {
  const client = createDeliveryClient();
  const siteUrl = process.env.HAKKITA_SITE_URL ?? '';
  const program = await loadPublishedProgram(client, programId);
  const news = toNewsRow(programId, input);
  const email = buildProgramNewsEmail(
    'pratinjau@hakkita.id',
    program,
    news,
    siteUrl,
    createProgramNewsEmailId('preview', news.id),
  );
  return {
    subject: email.subject,
    text: email.text,
    html: email.html.replace('cid:hakkita-logo', new URL('/hakkita-logo.png', siteUrl).toString()),
    eligibleCount: await countEligibleFollowers(client, programId),
  };
}

export async function sendManualProgramNews(programId: string, input: ProgramNewsInput) {
  const client = createDeliveryClient();
  await loadPublishedProgram(client, programId);
  const { data, error } = await client
    .from('program_news')
    .insert({
      program_id: programId,
      title: input.title,
      summary: input.summary,
      source_url: input.sourceUrl,
      published_on: input.publishedOn,
    })
    .select('id')
    .single();
  let newsId = data?.id;
  if (error) {
    if (error.code !== POSTGRES_UNIQUE_VIOLATION) throw error;
    const { data: existing, error: existingError } = await client
      .from('program_news')
      .select('id,title,summary')
      .eq('program_id', programId)
      .eq('source_url', input.sourceUrl)
      .single();
    if (existingError) throw existingError;
    if (existing.title !== input.title || existing.summary !== input.summary) {
      throw new DuplicateProgramNewsError();
    }
    newsId = existing.id;
  }
  if (!newsId) throw new Error('Kabar belum tersimpan');
  return { newsId, ...(await sendApprovedProgramNewsNow(newsId)) };
}
