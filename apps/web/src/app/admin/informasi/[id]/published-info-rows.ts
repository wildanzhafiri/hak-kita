import { formatDate } from '@hakkita/domain';
import type { Program } from '@hakkita/schema';
import type { ValidationPreviewRow } from '@/app/admin/validasi/types';
import { PUBLISHED_INFO_COPY as COPY } from './content';

function describePeriod(program: Program): string[] {
  if (!program.periode) return [];
  if (program.periode === 'sepanjang-tahun') return [COPY.fields.yearRound];
  return [`${formatDate(program.periode.buka)} sampai ${formatDate(program.periode.tutup)}`];
}

export function buildPublishedInfoRows(
  program: Program,
  regionName: string,
): ValidationPreviewRow[] {
  const fields = COPY.fields;
  return [
    { label: fields.name, values: [program.nama] },
    { label: fields.category, values: [program.kategori] },
    { label: fields.summary, values: [program.ringkasan] },
    { label: fields.about, values: program.tentang ? [program.tentang] : [] },
    { label: fields.organizer, values: [program.penyelenggara] },
    { label: fields.coverage, values: [regionName] },
    { label: fields.audience, values: program.untuk },
    { label: fields.benefits, values: program.manfaat ?? [] },
    { label: fields.requirements, values: program.syarat.map((requirement) => requirement.teks) },
    { label: fields.documents, values: program.dokumen },
    {
      label: fields.steps,
      values: program.langkah.map((step, index) => `${index + 1}. ${step}`),
    },
    { label: fields.period, values: describePeriod(program) },
    { label: fields.cost, values: program.biaya ? [program.biaya] : [] },
    { label: fields.officialLink, values: [program.sumberUtama.url] },
  ];
}
