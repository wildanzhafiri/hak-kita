import type { Kategori, Program } from '@hakkita/schema';
import type { ProgramFilter, WilayahIndex } from './types';
import {
  RANK_ALIAS_WEIGHT,
  RANK_CATEGORY_WEIGHT,
  RANK_MIN_PREFIX_LENGTH,
  RANK_NAME_WEIGHT,
  RANK_RELATIVE_THRESHOLD,
  RANK_STOP_WORDS,
  RANK_TEXT_WEIGHT,
} from './constants';
import { appliesIn } from './wilayah';

function searchableText(program: Program): string {
  return [
    program.nama,
    program.ringkasan,
    program.penyelenggara,
    program.kategori,
    ...(program.alias ?? []),
    ...program.syarat.map((s) => s.teks),
  ]
    .join(' ')
    .toLowerCase();
}

export function filterPrograms(
  programs: readonly Program[],
  filter: ProgramFilter,
  index: WilayahIndex,
): Program[] {
  const query = filter.query.trim().toLowerCase();
  return programs
    .filter((p) => appliesIn(p.cakupan.kode, filter.wilayah, index))
    .filter((p) => filter.kategori === null || p.kategori === filter.kategori)
    .filter((p) => query === '' || searchableText(p).includes(query))
    .sort((a, b) => a.nama.localeCompare(b.nama, 'id'));
}

export function listKategori(programs: readonly Program[]): Kategori[] {
  return [...new Set(programs.map((p) => p.kategori))].sort((a, b) => a.localeCompare(b, 'id'));
}

function rankWords(value: string): string[] {
  return value
    .toLocaleLowerCase('id-ID')
    .split(/[^\p{L}\p{N}]+/u)
    .filter((word) => word.length > 1);
}

function wordsMatch(words: readonly string[], term: string): boolean {
  return words.some(
    (word) => word === term || (term.length >= RANK_MIN_PREFIX_LENGTH && word.startsWith(term)),
  );
}

function rankScore(program: Program, terms: readonly string[]): { score: number; matched: number } {
  const name = rankWords(program.nama);
  const alias = rankWords((program.alias ?? []).join(' '));
  const category = rankWords(program.kategori);
  const text = rankWords([program.ringkasan, ...program.untuk].join(' '));
  return terms.reduce(
    (total, term) => {
      const score =
        (wordsMatch(name, term) ? RANK_NAME_WEIGHT : 0) +
        (wordsMatch(alias, term) ? RANK_ALIAS_WEIGHT : 0) +
        (wordsMatch(category, term) ? RANK_CATEGORY_WEIGHT : 0) +
        (wordsMatch(text, term) ? RANK_TEXT_WEIGHT : 0);
      return { score: total.score + score, matched: total.matched + (score > 0 ? 1 : 0) };
    },
    { score: 0, matched: 0 },
  );
}

export function rankPrograms(
  programs: readonly Program[],
  query: string,
  limit: number,
): Program[] {
  const terms = [...new Set(rankWords(query).filter((term) => !RANK_STOP_WORDS.has(term)))];
  if (terms.length === 0) return [];

  const minimumMatched = Math.ceil(terms.length / 2);
  const scored = programs
    .map((program) => ({ program, ...rankScore(program, terms) }))
    .filter(({ score, matched }) => score > 0 && matched >= minimumMatched)
    .sort(
      (left, right) =>
        right.score - left.score || left.program.nama.localeCompare(right.program.nama, 'id'),
    );
  const top = scored[0]?.score ?? 0;
  return scored
    .filter(({ score }) => score >= top * RANK_RELATIVE_THRESHOLD)
    .slice(0, limit)
    .map(({ program }) => program);
}
