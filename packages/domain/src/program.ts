import type { Program } from '@hakkita/schema';
import { KATEGORI_LAYANAN, STALE_AFTER_DAYS } from './constants';
import { checkSumberUtama, isOfficialDomain, isStale } from './source';
import type { CheckResult } from './types';

export function isLayanan(program: Program): boolean {
  return program.kategori === KATEGORI_LAYANAN;
}

export function programPath(program: Program): string {
  const section = isLayanan(program) ? '/urus-kebutuhanmu' : '/kenali-hakmu';
  return `${section}/${program.id}`;
}

export function berkasPath(program: Program): string {
  return `${programPath(program)}/berkas`;
}

export function checkProgram(program: Program, options: { today: string }): CheckResult {
  const errors: string[] = [];
  const warnings: string[] = [];

  const sourceIssue = checkSumberUtama(program.sumberUtama);
  if (sourceIssue) errors.push(sourceIssue);

  const allowsNonOfficial = program.sumberUtama.jenis === 'bank-penyalur';
  const checkSourceUrl = (label: string, url: string) => {
    if (!url.startsWith('https://')) {
      errors.push(`${label}: sumber harus memakai https`);
    } else if (!allowsNonOfficial && !isOfficialDomain(url)) {
      errors.push(`${label}: sumber harus berdomain .go.id`);
    }
  };

  program.syarat.forEach((s, i) => {
    if (s.sumberUrl) checkSourceUrl(`syarat[${i}]`, s.sumberUrl);
  });
  program.berkas?.dokumen.forEach((d, i) => checkSourceUrl(`berkas.dokumen[${i}]`, d.sumberUrl));
  program.berkas?.kendala.forEach((k, i) => checkSourceUrl(`berkas.kendala[${i}]`, k.sumberUrl));

  if (program.tanggalDiperiksa && program.tanggalDiperiksa > options.today) {
    errors.push('tanggalDiperiksa berada di masa depan');
  }

  if (program.verifikasi === 'belum') {
    warnings.push('Belum diverifikasi ke sumber resmi');
  } else if (program.tanggalDiperiksa && isStale(program.tanggalDiperiksa, options.today)) {
    warnings.push(
      `Terakhir diperiksa ${program.tanggalDiperiksa}, lebih dari ${STALE_AFTER_DAYS} hari lalu`,
    );
  }

  return { errors, warnings };
}
