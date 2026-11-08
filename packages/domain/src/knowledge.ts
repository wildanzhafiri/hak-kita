import type { KnowledgeDocument, Program } from '@hakkita/schema';
import type { ProgramKnowledgePassage, ProgramKnowledgeSearchOptions } from './types';

const SEARCH_STOP_WORDS = new Set([
  'apa',
  'bagaimana',
  'dan',
  'dari',
  'di',
  'ini',
  'itu',
  'ke',
  'untuk',
  'yang',
]);

const DEFAULT_RESULT_LIMIT = 5;
const MAX_RESULT_LIMIT = 10;

function searchTerms(value: string): string[] {
  return value
    .toLocaleLowerCase('id-ID')
    .split(/[^\p{L}\p{N}]+/u)
    .filter((term) => term.length > 1 && !SEARCH_STOP_WORDS.has(term));
}

function scorePassage(passage: ProgramKnowledgePassage, terms: readonly string[]): number {
  const name = searchTerms(passage.programName);
  const title = searchTerms(passage.title);
  const text = searchTerms(passage.text);
  return terms.reduce((score, term) => {
    return (
      score +
      (name.includes(term) ? 1 : 0) +
      (title.includes(term) ? 4 : 0) +
      (text.includes(term) ? 5 : 0)
    );
  }, 0);
}

export function buildCuratedKnowledge(
  documents: readonly KnowledgeDocument[],
  programs: readonly Program[],
): ProgramKnowledgePassage[] {
  const programsById = new Map(programs.map((program) => [program.id, program]));
  return documents.flatMap((document) => {
    const program = programsById.get(document.programId);
    if (!program || program.verifikasi === 'belum') return [];
    const verification = program.verifikasi;
    return document.passages.map((passage) => ({
      id: `${document.id}:${passage.id}`,
      programId: program.id,
      programName: program.nama,
      section: 'panduan',
      title: passage.title,
      text: passage.text,
      sourceUrl: document.sourceUrl,
      checkedOn: document.checkedOn,
      verification,
    }));
  });
}

export function buildProgramKnowledge(programs: readonly Program[]): ProgramKnowledgePassage[] {
  return programs.flatMap((program) => {
    if (program.verifikasi === 'belum' || !program.tanggalDiperiksa) return [];

    const provenance = {
      programId: program.id,
      programName: program.nama,
      checkedOn: program.tanggalDiperiksa,
      verification: program.verifikasi,
    };

    const requirements: ProgramKnowledgePassage[] = program.syarat.flatMap((syarat, index) =>
      syarat.sumberUrl
        ? [
            {
              ...provenance,
              id: `${program.id}:syarat:${index}`,
              section: 'syarat',
              title: `Syarat ${program.nama}`,
              text: syarat.teks,
              sourceUrl: syarat.sumberUrl,
            },
          ]
        : [],
    );
    const documents: ProgramKnowledgePassage[] =
      program.berkas?.dokumen.map((document) => ({
        ...provenance,
        id: `${program.id}:berkas:${document.id}`,
        section: 'berkas',
        title: `Berkas ${program.nama}`,
        text: [document.label, document.catatan].filter(Boolean).join('. '),
        sourceUrl: document.sumberUrl,
      })) ?? [];
    const obstacles: ProgramKnowledgePassage[] =
      program.berkas?.kendala.map((obstacle, index) => ({
        ...provenance,
        id: `${program.id}:kendala:${index}`,
        section: 'kendala',
        title: `Kendala ${program.nama}`,
        text: `${obstacle.masalah}. ${obstacle.langkah}`,
        sourceUrl: obstacle.sumberUrl,
      })) ?? [];

    return [...requirements, ...documents, ...obstacles];
  });
}

export function searchProgramKnowledge(
  passages: readonly ProgramKnowledgePassage[],
  query: string,
  options: ProgramKnowledgeSearchOptions = {},
): ProgramKnowledgePassage[] {
  const terms = [...new Set(searchTerms(query))];
  if (terms.length === 0) return [];

  const limit = Math.min(Math.max(options.limit ?? DEFAULT_RESULT_LIMIT, 1), MAX_RESULT_LIMIT);
  return passages
    .filter((passage) => !options.programId || passage.programId === options.programId)
    .map((passage) => ({ passage, score: scorePassage(passage, terms) }))
    .filter(({ score }) => score > 0)
    .sort(
      (left, right) => right.score - left.score || left.passage.id.localeCompare(right.passage.id),
    )
    .slice(0, limit)
    .map(({ passage }) => passage);
}
