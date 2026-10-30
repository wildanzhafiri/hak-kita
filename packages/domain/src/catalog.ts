import type { Kategori, Program } from '@hakkita/schema';
import type { ProgramFilter, WilayahIndex } from './types';
import { appliesIn } from './wilayah';

function searchableText(program: Program): string {
  return [
    program.nama,
    program.ringkasan,
    program.penyelenggara,
    program.kategori,
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
