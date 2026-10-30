import 'server-only';
import { readdir, readFile } from 'node:fs/promises';
import path from 'node:path';
import { parse } from 'yaml';
import { ProgramSchema, WilayahFileSchema, type Program, type WilayahFile } from '@hakkita/schema';
import type { DataIssue } from './types';

const DATA_DIR = process.env.HAKKITA_DATA_DIR ?? path.resolve(process.cwd(), '../../data');

function throwInvalid(source: string, issues: DataIssue[]): never {
  const details = issues.map(
    (i) => `  - ${i.path.map(String).join('.') || '(akar)'}: ${i.message}`,
  );
  throw new Error(`Data tidak valid: ${source}\n${details.join('\n')}`);
}

export async function loadPrograms(): Promise<Program[]> {
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

export async function loadWilayahFile(): Promise<WilayahFile> {
  const text = await readFile(path.join(DATA_DIR, 'wilayah', 'wilayah.json'), 'utf8');
  const parsed = WilayahFileSchema.safeParse(JSON.parse(text));
  if (!parsed.success) throwInvalid('wilayah/wilayah.json', parsed.error.issues);
  return parsed.data;
}
