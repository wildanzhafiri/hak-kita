import { readdirSync, readFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { parse } from 'yaml';
import {
  buildCuratedKnowledge,
  buildProgramKnowledge,
  searchProgramKnowledge,
} from '@hakkita/domain';
import {
  KnowledgeDocumentSchema,
  ProgramSchema,
  type KnowledgeDocument,
  type Program,
} from '@hakkita/schema';

const ROOT_DIR = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const DATA_DIR = process.env.HAKKITA_DATA_DIR?.trim() || path.join(ROOT_DIR, 'data');

function readYamlRecords<T>(folder: string, parseRecord: (value: unknown) => T): T[] {
  const dir = path.join(DATA_DIR, folder);
  return readdirSync(dir)
    .filter((file) => file.endsWith('.yaml'))
    .sort()
    .map((file) => parseRecord(parse(readFileSync(path.join(dir, file), 'utf8'))));
}

const query = process.argv.slice(2).join(' ').trim();
if (!query) {
  console.error('Masukkan pertanyaan, misalnya: pnpm knowledge:search NISN tidak terdaftar');
  process.exit(1);
}

const programs: Program[] = readYamlRecords('programs', (value) => ProgramSchema.parse(value));
const documents: KnowledgeDocument[] = readYamlRecords('knowledge', (value) =>
  KnowledgeDocumentSchema.parse(value),
);
const passages = [
  ...buildProgramKnowledge(programs),
  ...buildCuratedKnowledge(documents, programs),
];
const results = searchProgramKnowledge(passages, query);
console.log(JSON.stringify(results, null, 2));
