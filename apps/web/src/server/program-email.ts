import 'server-only';
import { createHash } from 'node:crypto';
import { formatDate, programPath } from '@hakkita/domain';
import type { ProgramChange, ProgramFollowSnapshot } from '@hakkita/domain';
import type { Program } from '@hakkita/schema';
import { PROGRAM_EMAIL_CHANGE_LABELS, PROGRAM_EMAIL_FOLLOW_COPY } from './content';
import { renderProgramEmailHtml } from './program-email-template';
import type {
  ProgramEmailBaseline,
  ProgramEmailDetail,
  ProgramEmailMessage,
  ProgramFollow,
} from './types';

export function resolveProgramEmailBaseline(
  state: { snapshot: ProgramFollowSnapshot; updated_at: string } | null,
  enabledAt: string,
  follow: ProgramFollow,
  current: ProgramFollowSnapshot,
): ProgramEmailBaseline {
  if (state && state.updated_at < enabledAt) return { snapshot: current, shouldSeed: true };
  if (!state && follow.created_at < enabledAt) return { snapshot: current, shouldSeed: true };
  return { snapshot: state?.snapshot ?? follow.snapshot, shouldSeed: !state };
}

export function createProgramEmailId(
  userId: string,
  programId: string,
  updatedAt: string,
  snapshot: unknown,
): string {
  return createHash('sha256')
    .update(JSON.stringify([userId, programId, updatedAt, snapshot]))
    .digest('hex');
}

export function buildProgramEmail(
  to: string,
  program: Program,
  changes: ProgramChange[],
  previous: ProgramFollowSnapshot,
  siteUrl: string,
  idempotencyKey: string,
): ProgramEmailMessage {
  const detailsUrl = new URL(programPath(program), siteUrl).toString();
  const settingsUrl = new URL('/rencanaku', siteUrl).toString();
  const changeDetails: ProgramEmailDetail[] = changes.map((change) => {
    const notes: string[] = [];
    if (
      change === 'periode' ||
      change === 'dibuka' ||
      change === 'ditutup' ||
      change === 'tenggat'
    ) {
      if (program.periode === 'sepanjang-tahun')
        notes.push('Periode yang tercatat: sepanjang tahun');
      if (program.periode && typeof program.periode === 'object') {
        notes.push(
          `Jadwal yang tercatat: ${formatDate(program.periode.buka)} sampai ${formatDate(program.periode.tutup)}`,
        );
      }
    }
    if (change === 'syarat') {
      const current = program.syarat.map(({ teks }) => teks);
      notes.push(
        ...current
          .filter((teks) => !previous.syarat.includes(teks))
          .map((teks) => `Kini tercantum: ${teks}`),
      );
      notes.push(
        ...previous.syarat
          .filter((teks) => !current.includes(teks))
          .map((teks) => `Tidak lagi tercantum: ${teks}`),
      );
    }
    if (change === 'dokumen') {
      const current = [
        ...program.dokumen,
        ...(program.berkas?.dokumen.map(({ label }) => label) ?? []),
      ];
      notes.push(
        ...current
          .filter((label) => !previous.dokumen.includes(label))
          .map((label) => `Kini tercantum: ${label}`),
      );
      notes.push(
        ...previous.dokumen
          .filter((label) => !current.includes(label))
          .map((label) => `Tidak lagi tercantum: ${label}`),
      );
    }
    return { title: PROGRAM_EMAIL_CHANGE_LABELS[change], notes };
  });
  const changeLines = changeDetails.flatMap(({ title, notes }) => [
    `- ${title}`,
    ...notes.map((note) => `  ${note}`),
  ]);

  return {
    to,
    subject: `Pembaruan ${program.nama} di HAKKITA`,
    text: [
      `Ada pembaruan pada informasi ${program.nama} yang kamu ikuti:`,
      '',
      ...changeLines,
      '',
      `Lihat informasi di HAKKITA: ${detailsUrl}`,
      `Periksa ketentuan terbaru di sumber resmi: ${program.sumberUtama.url}`,
      '',
      'Informasi ini bukan keputusan penerimaan program.',
      `Atur pemberitahuan email di Rencanaku: ${settingsUrl}`,
    ].join('\n'),
    html: renderProgramEmailHtml({
      heading: `Informasi ${program.nama} berubah`,
      intro:
        'Ada perubahan pada informasi program yang kamu ikuti. Lihat ringkasannya di bawah ini.',
      programName: program.nama,
      contextLabel: 'Yang berubah',
      contextTitle: 'Perubahan yang kami catat',
      details: changeDetails,
      actionLabel: 'Lihat rincian program',
      actionUrl: detailsUrl,
      sources: [{ label: 'Laman resmi program', url: program.sumberUtama.url }],
      settingsUrl,
    }),
    idempotencyKey,
  };
}

export function buildProgramFollowEmail(
  to: string,
  program: Program,
  siteUrl: string,
  idempotencyKey: string,
): ProgramEmailMessage {
  const detailsUrl = new URL(programPath(program), siteUrl).toString();
  const settingsUrl = new URL('/rencanaku', siteUrl).toString();
  const intro = `Kamu mengikuti ${program.nama} di HAKKITA dan mengaktifkan pemberitahuan email.`;

  return {
    to,
    subject: `Pemberitahuan ${program.nama} di HAKKITA`,
    text: [
      intro,
      '',
      PROGRAM_EMAIL_FOLLOW_COPY.contextBody,
      '',
      `Lihat rincian program: ${detailsUrl}`,
      `Periksa sumber resmi: ${program.sumberUtama.url}`,
      '',
      'Informasi ini bukan keputusan penerimaan program.',
      `Atur pemberitahuan email di Rencanaku: ${settingsUrl}`,
    ].join('\n'),
    html: renderProgramEmailHtml({
      heading: PROGRAM_EMAIL_FOLLOW_COPY.heading,
      intro,
      programName: program.nama,
      contextLabel: PROGRAM_EMAIL_FOLLOW_COPY.contextLabel,
      contextTitle: PROGRAM_EMAIL_FOLLOW_COPY.contextTitle,
      contextBody: PROGRAM_EMAIL_FOLLOW_COPY.contextBody,
      actionLabel: PROGRAM_EMAIL_FOLLOW_COPY.actionLabel,
      actionUrl: detailsUrl,
      sources: [{ label: 'Laman resmi program', url: program.sumberUtama.url }],
      settingsUrl,
    }),
    idempotencyKey,
  };
}
