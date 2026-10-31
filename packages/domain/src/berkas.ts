import type { Berkas, BerkasDokumen, BerkasPertanyaan } from '@hakkita/schema';
import { BERKAS_NOTE_MAX_LENGTH } from './constants';
import type { BerkasAnswers, BerkasProgress, BerkasReadiness } from './types';

export const EMPTY_BERKAS_PROGRESS: BerkasProgress = { answers: {}, checked: [], note: '' };

export function hasBerkasProgress(progress: BerkasProgress): boolean {
  return (
    Object.keys(progress.answers).length > 0 ||
    progress.checked.length > 0 ||
    progress.note.trim() !== ''
  );
}

export function selectDokumen(berkas: Berkas, answers: BerkasAnswers): BerkasDokumen[] {
  return berkas.dokumen.filter((dokumen) => {
    if (!dokumen.kondisi) return true;
    const answer = answers[dokumen.kondisi.pertanyaan];
    return answer !== undefined && dokumen.kondisi.nilai.includes(answer);
  });
}

export function unansweredQuestions(berkas: Berkas, answers: BerkasAnswers): BerkasPertanyaan[] {
  return berkas.pertanyaan.filter((p) => answers[p.id] === undefined);
}

export function berkasReadiness(
  dokumen: readonly BerkasDokumen[],
  checked: readonly string[],
): BerkasReadiness {
  const ready = dokumen.filter((d) => checked.includes(d.id)).length;
  return { ready, total: dokumen.length };
}

function isStringRecord(value: unknown): value is Record<string, string> {
  return (
    typeof value === 'object' &&
    value !== null &&
    !Array.isArray(value) &&
    Object.values(value).every((v) => typeof v === 'string')
  );
}

function isStringArray(value: unknown): value is string[] {
  return Array.isArray(value) && value.every((v) => typeof v === 'string');
}

export function parseBerkasProgress(raw: string | null): BerkasProgress {
  if (raw === null) return EMPTY_BERKAS_PROGRESS;
  let value: unknown;
  try {
    value = JSON.parse(raw);
  } catch {
    return EMPTY_BERKAS_PROGRESS;
  }
  if (typeof value !== 'object' || value === null) return EMPTY_BERKAS_PROGRESS;
  const { answers, checked, note } = value as Record<string, unknown>;
  return {
    answers: isStringRecord(answers) ? answers : {},
    checked: isStringArray(checked) ? checked : [],
    note: typeof note === 'string' ? note.slice(0, BERKAS_NOTE_MAX_LENGTH) : '',
  };
}

export function serializeBerkasProgress(progress: BerkasProgress): string {
  return JSON.stringify({
    answers: progress.answers,
    checked: progress.checked,
    note: progress.note.slice(0, BERKAS_NOTE_MAX_LENGTH),
  });
}

export function prunedChecked(
  checked: readonly string[],
  visible: readonly BerkasDokumen[],
): string[] {
  const visibleIds = new Set(visible.map((d) => d.id));
  return checked.filter((id) => visibleIds.has(id));
}
