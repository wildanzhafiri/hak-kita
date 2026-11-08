import 'server-only';
import { readdir, readFile } from 'node:fs/promises';
import path from 'node:path';
import { parse } from 'yaml';
import { createClient } from '@supabase/supabase-js';
import {
  KnowledgeDocumentSchema,
  ProgramSchema,
  WilayahFileSchema,
  type KnowledgeDocument,
  type Program,
  type WilayahFile,
} from '@hakkita/schema';
import type { Database } from '@/lib/supabase/types';
import type { DataIssue } from './types';

const DATA_DIR = process.env.HAKKITA_DATA_DIR?.trim() || path.resolve(process.cwd(), '../../data');

function throwInvalid(source: string, issues: DataIssue[]): never {
  const details = issues.map(
    (i) => `  - ${i.path.map(String).join('.') || '(akar)'}: ${i.message}`,
  );
  throw new Error(`Data tidak valid: ${source}\n${details.join('\n')}`);
}

export async function loadPrograms(): Promise<Program[]> {
  const remotePrograms = await loadProgramRecordsFromDatabase();
  if (remotePrograms) return remotePrograms;

  const dir = path.join(DATA_DIR, 'programs');
  const files = (await readdir(dir)).filter((f) => f.endsWith('.yaml')).sort();
  return Promise.all(
    files.map(async (file) => {
      const parsed = ProgramSchema.safeParse(parse(await readFile(path.join(dir, file), 'utf8')));
      if (!parsed.success) throwInvalid(`programs/${file}`, parsed.error.issues);
      return parsed.data;
    }),
  );
}

export async function loadKnowledgeDocuments(): Promise<KnowledgeDocument[]> {
  const remoteDocuments = await loadKnowledgeDocumentsFromDatabase();
  if (remoteDocuments) return remoteDocuments;

  const dir = path.join(DATA_DIR, 'knowledge');
  const files = (await readdir(dir)).filter((file) => file.endsWith('.yaml')).sort();
  return Promise.all(
    files.map(async (file) => {
      const parsed = KnowledgeDocumentSchema.safeParse(
        parse(await readFile(path.join(dir, file), 'utf8')),
      );
      if (!parsed.success) throwInvalid(`knowledge/${file}`, parsed.error.issues);
      if (`${parsed.data.id}.yaml` !== file) {
        throw new Error(`ID bahan tidak cocok dengan nama berkas: ${file}`);
      }
      return parsed.data;
    }),
  );
}

async function loadKnowledgeDocumentsFromDatabase(): Promise<KnowledgeDocument[] | null> {
  if (process.env.DEMO_OFFLINE === 'true') return null;

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !serviceRoleKey) return null;

  try {
    const databaseClient = createClient<Database>(url, serviceRoleKey, {
      auth: { autoRefreshToken: false, persistSession: false },
    });
    const { data, error } = await databaseClient
      .from('program_knowledge_documents')
      .select('id,program_id,record')
      .order('id');
    if (error) throw error;
    if (data.length === 0) return null;

    const parsed = KnowledgeDocumentSchema.array().safeParse(data.map((row) => row.record));
    if (!parsed.success) throwInvalid('Supabase knowledge', parsed.error.issues);
    if (
      data.some(
        (row, index) =>
          row.id !== parsed.data[index]?.id || row.program_id !== parsed.data[index]?.programId,
      )
    ) {
      throw new Error('ID bahan Supabase tidak cocok dengan record');
    }
    return parsed.data;
  } catch {
    return null;
  }
}

async function loadProgramRecordsFromDatabase(): Promise<Program[] | null> {
  if (process.env.DEMO_OFFLINE === 'true') return null;

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !serviceRoleKey) return null;

  try {
    const databaseClient = createClient<Database>(url, serviceRoleKey, {
      auth: { autoRefreshToken: false, persistSession: false },
    });
    const { data, error } = await databaseClient.from('programs').select('id, record').order('id');
    if (error) throw error;
    if (data.length === 0) return null;

    const records = data.map((row) => row.record);
    const parsed = ProgramSchema.array().safeParse(records);
    if (!parsed.success) throwInvalid('Supabase programs', parsed.error.issues);
    if (data.some((row, index) => row.id !== parsed.data[index]?.id)) {
      throw new Error('ID program Supabase tidak cocok dengan record');
    }
    return parsed.data;
  } catch {
    return null;
  }
}

export async function loadWilayahFile(): Promise<WilayahFile> {
  const text = await readFile(path.join(DATA_DIR, 'wilayah', 'wilayah.json'), 'utf8');
  const parsed = WilayahFileSchema.safeParse(JSON.parse(text));
  if (!parsed.success) throwInvalid('wilayah/wilayah.json', parsed.error.issues);
  return parsed.data;
}
