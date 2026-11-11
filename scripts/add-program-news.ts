import { existsSync } from 'node:fs';
import path from 'node:path';
import { loadEnvFile } from 'node:process';
import { fileURLToPath } from 'node:url';
import { isOfficialDomain, todayWIB } from '@hakkita/domain';

const ROOT_DIR = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const envFile = path.join(ROOT_DIR, 'apps', 'web', '.env.local');
if (existsSync(envFile)) loadEnvFile(envFile);

function readOption(name: string): string {
  const index = process.argv.indexOf(name);
  const value = index >= 0 ? process.argv[index + 1]?.trim() : undefined;
  if (!value || value.startsWith('--')) throw new Error(`Argumen ${name} wajib diisi`);
  return value;
}

function readPublishedOn(): string {
  const value = readOption('--date');
  if (
    !/^\d{4}-\d{2}-\d{2}$/.test(value) ||
    new Date(`${value}T00:00:00Z`).toISOString().slice(0, 10) !== value
  ) {
    throw new Error('Tanggal harus berbentuk YYYY-MM-DD yang valid');
  }
  if (value > todayWIB()) throw new Error('Tanggal terbit tidak boleh di masa depan');
  return value;
}

async function main(): Promise<void> {
  const programId = readOption('--program');
  const title = readOption('--title');
  const summary = readOption('--summary');
  const sourceUrl = readOption('--source');
  const publishedOn = readPublishedOn();
  const isApply = process.argv.includes('--apply');

  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(programId)) throw new Error('ID program tidak valid');
  if (title.length < 8 || title.length > 180) throw new Error('Judul harus 8-180 karakter');
  if (summary.length < 20 || summary.length > 600)
    throw new Error('Ringkasan harus 20-600 karakter');
  if (!sourceUrl.startsWith('https://') || !isOfficialDomain(sourceUrl)) {
    throw new Error('Sumber kabar harus URL https dari situs resmi .go.id');
  }

  console.log(`Program: ${programId}`);
  console.log(`Judul: ${title}`);
  console.log(`Ringkasan: ${summary}`);
  console.log(`Sumber: ${sourceUrl}`);
  console.log(`Terbit: ${publishedOn}`);
  if (!isApply) {
    console.log('Pratinjau saja. Tambahkan --apply setelah isi cocok dengan sumber resmi.');
    return;
  }

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) throw new Error('URL dan service role key Supabase belum diatur');
  const endpoint = url.replace(/\/$/, '');
  const headers = { apikey: key, 'Content-Type': 'application/json' };
  const programResponse = await fetch(
    `${endpoint}/rest/v1/programs?id=eq.${encodeURIComponent(programId)}&select=id`,
    {
      headers,
    },
  );
  if (!programResponse.ok)
    throw new Error(`Pemeriksaan program gagal: HTTP ${programResponse.status}`);
  const programs: unknown = await programResponse.json();
  if (!Array.isArray(programs) || programs.length !== 1) {
    throw new Error('Program belum ada di Supabase. Impor data program lebih dulu.');
  }

  const response = await fetch(
    `${endpoint}/rest/v1/program_news?on_conflict=program_id,source_url,published_on,title`,
    {
      method: 'POST',
      headers: { ...headers, Prefer: 'resolution=merge-duplicates,return=minimal' },
      body: JSON.stringify({
        program_id: programId,
        title,
        summary,
        source_url: sourceUrl,
        published_on: publishedOn,
      }),
    },
  );
  if (!response.ok) throw new Error(`Kabar belum tersimpan: HTTP ${response.status}`);
  console.log(
    'Kabar tersimpan di Supabase. Pengikut yang sudah mengaktifkan email akan diperiksa pada jadwal berikutnya.',
  );
}

main().catch((error: unknown) => {
  console.error(error instanceof Error ? error.message : 'Kabar belum dapat ditambahkan');
  process.exitCode = 1;
});
