import { existsSync } from 'node:fs';
import path from 'node:path';
import { loadEnvFile } from 'node:process';
import { fileURLToPath } from 'node:url';

const ROOT_DIR = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const envFile = path.join(ROOT_DIR, 'apps', 'web', '.env.local');
if (existsSync(envFile)) loadEnvFile(envFile);

async function main(): Promise<void> {
  const emailIndex = process.argv.indexOf('--email');
  const email = emailIndex >= 0 ? process.argv[emailIndex + 1]?.trim() : undefined;
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    throw new Error('Gunakan --email alamat-akun-yang-mengikuti-program');
  }
  const secret = process.env.CRON_SECRET;
  if (!secret) throw new Error('CRON_SECRET belum diatur');
  const endpoint = new URL('http://localhost:3000/api/cron/program-email');
  endpoint.searchParams.set('testEmail', email);
  if (!process.argv.includes('--run')) endpoint.searchParams.set('preview', '1');
  const response = await fetch(endpoint, {
    headers: { Authorization: `Bearer ${secret}` },
  });
  const result: unknown = await response.json();
  if (!response.ok) {
    const detail =
      result && typeof result === 'object' && 'error' in result && typeof result.error === 'string'
        ? result.error
        : `HTTP ${response.status}`;
    throw new Error(`Pemeriksaan email gagal: ${detail}`);
  }
  console.log(result);
}

main().catch((error: unknown) => {
  console.error(error instanceof Error ? error.message : 'Pengujian email gagal');
  process.exitCode = 1;
});
