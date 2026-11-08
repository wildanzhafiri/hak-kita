import { execFileSync } from 'node:child_process';
import { existsSync, readdirSync, readFileSync } from 'node:fs';
import path from 'node:path';
import { loadEnvFile } from 'node:process';
import { fileURLToPath } from 'node:url';
import { parse } from 'yaml';
import { KnowledgeDocumentSchema, type KnowledgeDocument } from '@hakkita/schema';

const ROOT_DIR = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const ENV_FILE = path.join(ROOT_DIR, '.env.local');
if (existsSync(ENV_FILE)) loadEnvFile(ENV_FILE);

const DATA_DIR = process.env.HAKKITA_DATA_DIR?.trim() || path.join(ROOT_DIR, 'data');
const KNOWLEDGE_DIR = path.join(DATA_DIR, 'knowledge');

function readKnowledgeDocuments(): KnowledgeDocument[] {
  const files = readdirSync(KNOWLEDGE_DIR)
    .filter((file) => file.endsWith('.yaml'))
    .sort();
  if (files.length === 0) throw new Error('Tidak ada bahan pengetahuan untuk diimpor');

  return files.map((file) => {
    const raw: unknown = parse(readFileSync(path.join(KNOWLEDGE_DIR, file), 'utf8'));
    const parsed = KnowledgeDocumentSchema.safeParse(raw);
    if (!parsed.success) {
      throw new Error(`Bahan tidak valid: ${file}: ${parsed.error.message}`);
    }
    return parsed.data;
  });
}

async function main(): Promise<void> {
  execFileSync(
    process.platform === 'win32' ? 'cmd.exe' : 'pnpm',
    process.platform === 'win32' ? ['/d', '/s', '/c', 'pnpm.cmd validate:data'] : ['validate:data'],
    { cwd: ROOT_DIR, stdio: 'inherit' },
  );

  const documents = readKnowledgeDocuments();
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !serviceRoleKey) {
    throw new Error('NEXT_PUBLIC_SUPABASE_URL dan SUPABASE_SERVICE_ROLE_KEY wajib diatur');
  }

  const response = await fetch(
    `${url.replace(/\/$/, '')}/rest/v1/program_knowledge_documents?on_conflict=id`,
    {
      method: 'POST',
      headers: {
        apikey: serviceRoleKey,
        'Content-Type': 'application/json',
        Prefer: 'resolution=merge-duplicates,return=minimal',
      },
      body: JSON.stringify(
        documents.map((record) => ({
          id: record.id,
          program_id: record.programId,
          record,
          updated_at: new Date().toISOString(),
        })),
      ),
    },
  );
  if (!response.ok) {
    throw new Error(`Impor bahan pengetahuan gagal dengan status HTTP ${response.status}`);
  }
  console.log(`${documents.length} bahan pengetahuan berhasil diimpor ke Supabase`);
}

main().catch((error: unknown) => {
  console.error(error instanceof Error ? error.message : 'Impor bahan pengetahuan gagal');
  process.exitCode = 1;
});
