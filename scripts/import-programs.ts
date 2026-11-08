import { execFileSync } from 'node:child_process';
import { existsSync, readdirSync, readFileSync } from 'node:fs';
import path from 'node:path';
import { loadEnvFile } from 'node:process';
import { fileURLToPath } from 'node:url';
import { parse } from 'yaml';
import { ProgramSchema, type Program } from '@hakkita/schema';

const ROOT_DIR = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

if (existsSync(path.join(ROOT_DIR, '.env.local'))) {
  loadEnvFile(path.join(ROOT_DIR, '.env.local'));
}

const DATA_DIR = process.env.HAKKITA_DATA_DIR?.trim() || path.join(ROOT_DIR, 'data');
const PROGRAMS_DIR = path.join(DATA_DIR, 'programs');

function readPrograms(): Program[] {
  const files = readdirSync(PROGRAMS_DIR).filter((file) => file.endsWith('.yaml')).sort();
  if (files.length === 0) throw new Error('Tidak ada berkas program YAML untuk diimpor');

  const programs = files.map((file) => {
    const raw: unknown = parse(readFileSync(path.join(PROGRAMS_DIR, file), 'utf8'));
    const parsed = ProgramSchema.safeParse(raw);
    if (!parsed.success) {
      const detail = parsed.error.issues
        .map((issue) => `${issue.path.map(String).join('.') || '(akar)'}: ${issue.message}`)
        .join('\n');
      throw new Error(`Data tidak valid: programs/${file}\n${detail}`);
    }
    if (`${parsed.data.id}.yaml` !== file) {
      throw new Error(`ID program "${parsed.data.id}" tidak sama dengan nama berkas ${file}`);
    }
    return parsed.data;
  });

  if (new Set(programs.map((program) => program.id)).size !== programs.length) {
    throw new Error('Impor dibatalkan: ditemukan ID program ganda');
  }
  return programs;
}

async function main(): Promise<void> {
  execFileSync(
    process.platform === 'win32' ? 'cmd.exe' : 'pnpm',
    process.platform === 'win32' ? ['/d', '/s', '/c', 'pnpm.cmd validate:data'] : ['validate:data'],
    { cwd: ROOT_DIR, stdio: 'inherit' },
  );

  const programs = readPrograms();
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !serviceRoleKey) {
    throw new Error('NEXT_PUBLIC_SUPABASE_URL dan SUPABASE_SERVICE_ROLE_KEY wajib diatur');
  }

  const response = await fetch(`${url.replace(/\/$/, '')}/rest/v1/programs?on_conflict=id`, {
    method: 'POST',
    headers: {
      apikey: serviceRoleKey,
      'Content-Type': 'application/json',
      Prefer: 'resolution=merge-duplicates,return=minimal',
    },
    body: JSON.stringify(
      programs.map((record) => ({ id: record.id, record })),
    ),
  });

  if (!response.ok) {
    throw new Error(`Impor Supabase gagal dengan status HTTP ${response.status}`);
  }
  console.log(`${programs.length} program berhasil diimpor ke Supabase`);
}

main().catch((error: unknown) => {
  console.error(error instanceof Error ? error.message : 'Impor program gagal');
  process.exitCode = 1;
});
