import { existsSync, readdirSync, readFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { parse } from 'yaml';
import { ProgramSchema, WilayahFileSchema, type Program } from '@hakkita/schema';
import {
  buildWilayahIndex,
  checkProgram,
  todayWIB,
  validateWilayahList,
  type WilayahIndex,
} from '@hakkita/domain';
import type { ZodIssue } from './types';

const ROOT_DIR = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const DATA_DIR = process.env.HAKKITA_DATA_DIR ?? path.join(ROOT_DIR, 'data');
const WILAYAH_FILE = 'wilayah/wilayah.json';
const strict = process.argv.includes('--strict');
const today = todayWIB();

let errorCount = 0;
let warningCount = 0;

function reportError(file: string, message: string): void {
  errorCount++;
  console.error(`  GALAT      ${file}: ${message}`);
}

function reportWarning(file: string, message: string): void {
  warningCount++;
  console.warn(`  PERINGATAN ${file}: ${message}`);
}

function describeIssues(issues: ZodIssue[]): string[] {
  return issues.map((i) => `${i.path.map(String).join('.') || '(akar)'}: ${i.message}`);
}

function validateWilayahFile(): WilayahIndex | null {
  const file = path.join(DATA_DIR, WILAYAH_FILE);
  if (!existsSync(file)) {
    reportError(WILAYAH_FILE, 'berkas tidak ditemukan');
    return null;
  }

  let raw: unknown;
  try {
    raw = JSON.parse(readFileSync(file, 'utf8'));
  } catch (e) {
    reportError(WILAYAH_FILE, `JSON tidak valid: ${(e as Error).message}`);
    return null;
  }

  const parsed = WilayahFileSchema.safeParse(raw);
  if (!parsed.success) {
    describeIssues(parsed.error.issues).forEach((m) => reportError(WILAYAH_FILE, m));
    return null;
  }

  validateWilayahList(parsed.data.wilayah).forEach((m) => reportError(WILAYAH_FILE, m));
  console.log(`  wilayah: ${parsed.data.wilayah.length} entri (${parsed.data.versiKode})`);
  return buildWilayahIndex(parsed.data.wilayah);
}

function readProgram(dir: string, fileName: string): Program | null {
  const label = `programs/${fileName}`;

  let raw: unknown;
  try {
    raw = parse(readFileSync(path.join(dir, fileName), 'utf8'));
  } catch (e) {
    reportError(label, `YAML tidak valid: ${(e as Error).message}`);
    return null;
  }

  const parsed = ProgramSchema.safeParse(raw);
  if (!parsed.success) {
    describeIssues(parsed.error.issues).forEach((m) => reportError(label, m));
    return null;
  }
  return parsed.data;
}

function checkCoverage(label: string, program: Program, index: WilayahIndex): void {
  const wilayah = index.get(program.cakupan.kode);
  if (!wilayah) {
    reportError(label, `cakupan.kode "${program.cakupan.kode}" tidak ada di data wilayah`);
  } else if (wilayah.level !== program.cakupan.level) {
    reportError(
      label,
      `cakupan.level "${program.cakupan.level}" tidak cocok dengan wilayah (${wilayah.level})`,
    );
  }
}

function validatePrograms(index: WilayahIndex | null): void {
  const dir = path.join(DATA_DIR, 'programs');
  const files = existsSync(dir)
    ? readdirSync(dir)
        .filter((f) => f.endsWith('.yaml'))
        .sort()
    : [];
  if (files.length === 0) reportError('programs/', 'tidak ada berkas .yaml');

  const seenIds = new Map<string, string>();
  const levels = { lengkap: 0, dasar: 0, belum: 0 };

  for (const fileName of files) {
    const label = `programs/${fileName}`;
    const program = readProgram(dir, fileName);
    if (!program) continue;
    levels[program.verifikasi]++;

    if (`${program.id}.yaml` !== fileName) {
      reportError(label, `id "${program.id}" harus sama dengan nama berkas`);
    }
    const duplicateOf = seenIds.get(program.id);
    if (duplicateOf) reportError(label, `id ganda dengan ${duplicateOf}`);
    seenIds.set(program.id, label);

    if (index) checkCoverage(label, program, index);

    const result = checkProgram(program, { today });
    result.errors.forEach((m) => reportError(label, m));
    result.warnings.forEach((m) => reportWarning(label, m));
  }

  console.log(
    `\n${files.length} program: ${levels.lengkap} lengkap, ${levels.dasar} dasar, ` +
      `${levels.belum} belum diverifikasi`,
  );
}

console.log(`Validasi data HAKKITA (${today})${strict ? ' [strict]' : ''}\n`);
validatePrograms(validateWilayahFile());
console.log(`${errorCount} galat, ${warningCount} peringatan`);

const failed = errorCount > 0 || (strict && warningCount > 0);
console.log(failed ? '\nGAGAL' : '\nOK');
process.exit(failed ? 1 : 0);
