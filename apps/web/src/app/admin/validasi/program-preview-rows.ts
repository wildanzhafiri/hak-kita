import { formatDate } from '@hakkita/domain';
import type { Program } from '@hakkita/schema';
import { ADMIN_KIND_LABELS } from '@/features/admin/constants';
import { VALIDATION_DETAIL_COPY as COPY } from './content';
import type { ProgramPreviewRows } from './types';

function describePeriod(program: Program): string[] {
  if (!program.periode) return [];
  if (program.periode === 'sepanjang-tahun') return [COPY.programFields.yearRound];
  return [`${formatDate(program.periode.buka)} sampai ${formatDate(program.periode.tutup)}`];
}

export function buildProgramPreviewRows(program: Program, regionName: string): ProgramPreviewRows {
  const fields = COPY.programFields;
  return {
    primary: [
      { label: fields.name, values: [program.nama] },
      { label: fields.kind, values: [ADMIN_KIND_LABELS[program.jenis]] },
      { label: fields.category, values: [program.kategori] },
      { label: fields.organizer, values: [program.penyelenggara] },
      { label: fields.summary, values: [program.ringkasan] },
      { label: fields.about, values: program.tentang ? [program.tentang] : [] },
    ],
    detail: [
      { label: fields.audience, values: program.untuk },
      { label: fields.coverage, values: [regionName] },
      { label: fields.requirements, values: program.syarat.map((requirement) => requirement.teks) },
      {
        label: fields.steps,
        values: program.langkah.map((step, index) => `${index + 1}. ${step}`),
      },
      { label: fields.documents, values: program.dokumen },
      { label: fields.period, values: describePeriod(program) },
      { label: fields.cost, values: program.biaya ? [program.biaya] : [] },
      { label: fields.officialLink, values: [program.sumberUtama.url] },
    ],
  };
}
