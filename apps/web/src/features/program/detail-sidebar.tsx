import Link from 'next/link';
import { FileCheck } from 'lucide-react';
import { berkasPath, formatDate, hostnameOf, isStale } from '@hakkita/domain';
import { OfficialSiteLink } from '@/components/program/official-site-link';
import { SaveButton } from '@/components/program/save-button';
import { VerifikasiBadge } from '@/components/program/verifikasi-badge';
import type { DetailSidebarProps } from './types';

export function DetailSidebar({ program, today }: DetailSidebarProps) {
  const stale = program.tanggalDiperiksa !== undefined && isStale(program.tanggalDiperiksa, today);
  const host = hostnameOf(program.sumberUtama.url) ?? program.sumberUtama.url;

  return (
    <aside className="min-w-0 rounded-[14px] border border-[var(--border)] bg-[var(--surface)] p-6 lg:sticky lg:top-24">
      <span className="category">{program.kategori}</span>
      <h2 className="mt-4 text-[21px] tracking-normal">Lanjutkan pengurusan</h2>
      <p className="mb-4 mt-2 text-[13px] leading-6 text-[var(--muted)]">
        Baca syarat dan langkahnya, lalu buka kanal resmi penyelenggara.
      </p>
      <div className={`verify-box ${program.verifikasi}`}>
        <VerifikasiBadge tingkat={program.verifikasi} />
        <span className="when">
          {program.tanggalDiperiksa
            ? `Diperiksa ${formatDate(program.tanggalDiperiksa)}`
            : 'Belum diperiksa'}
        </span>
      </div>
      {stale && (
        <p className="mt-3 text-[13px] leading-6 text-[var(--muted)]">
          Pemeriksaan terakhir sudah lama; informasi mungkin sudah berubah.
        </p>
      )}
      {program.berkas && (
        <Link className="button full" href={berkasPath(program)}>
          Siapkan berkasmu <FileCheck size={17} />
        </Link>
      )}
      <OfficialSiteLink
        url={program.sumberUtama.url}
        className={program.berkas ? 'button secondary full' : 'button full'}
      />
      <SaveButton program={program} variant="button" />
      <small className="mt-5 block text-[11px] leading-5 text-[var(--muted)]">
        Sumber: {host}. HAKKITA tidak mengajukan permohonan atas namamu.
      </small>
    </aside>
  );
}
