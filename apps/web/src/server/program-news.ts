import 'server-only';
import { createHash } from 'node:crypto';
import { formatDate, programPath } from '@hakkita/domain';
import type { Program } from '@hakkita/schema';
import { renderProgramEmailHtml } from './program-email-template';
import type { ProgramEmailMessage, ProgramEmailNote, ProgramEmailSource, ProgramNews } from './types';

export function createProgramNewsEmailId(userId: string, newsId: string): string {
  return createHash('sha256')
    .update(JSON.stringify([userId, newsId]))
    .digest('hex');
}

export function buildProgramNewsEmail(
  to: string,
  program: Program,
  news: ProgramNews,
  siteUrl: string,
  idempotencyKey: string,
  note?: ProgramEmailNote,
): ProgramEmailMessage {
  const detailsUrl = new URL(programPath(program), siteUrl).toString();
  const settingsUrl = new URL('/rencanaku', siteUrl).toString();
  const sources: ProgramEmailSource[] = [
    { label: 'Baca pengumuman penyelenggara', url: news.source_url },
  ];
  if (program.sumberUtama.url !== news.source_url) {
    sources.push({ label: 'Laman resmi program', url: program.sumberUtama.url });
  }

  return {
    to,
    subject: `Kabar ${program.nama}: ${news.title}`,
    text: [
      `Ada kabar tentang ${program.nama} yang kamu ikuti di HAKKITA.`,
      '',
      news.title,
      `Diterbitkan ${formatDate(news.published_on)}`,
      '',
      news.summary,
      ...(note ? ['', `${note.title}: ${note.body}`] : []),
      '',
      ...sources.map((source) => `${source.label}: ${source.url}`),
      `Lihat rincian program di HAKKITA: ${detailsUrl}`,
      '',
      'HAKKITA tidak menentukan penerima program. Periksa ketentuan terbaru di sumber resmi.',
      `Atur pemberitahuan email di Rencanaku: ${settingsUrl}`,
    ].join('\n'),
    html: renderProgramEmailHtml({
      heading: news.title,
      intro: `Ada informasi dari sumber resmi tentang ${program.nama} yang kamu ikuti.`,
      programName: program.nama,
      contextLabel: 'Isi pengumuman',
      contextMeta: `Diterbitkan ${formatDate(news.published_on)}`,
      contextBody: news.summary,
      note,
      actionLabel: 'Lihat rincian program',
      actionUrl: detailsUrl,
      sources,
      settingsUrl,
    }),
    idempotencyKey,
  };
}
