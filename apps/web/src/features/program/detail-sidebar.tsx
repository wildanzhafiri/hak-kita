import Link from 'next/link';
import { ArrowUpRight, FileCheck } from 'lucide-react';
import { berkasPath, formatDate, hostnameOf, isStale } from '@hakkita/domain';
import { OfficialSiteLink } from '@/components/program/official-site-link';
import { VerifikasiBadge } from '@/components/program/verifikasi-badge';
import type { DetailSidebarProps } from './types';

export function DetailSidebar({ program, today, onShowSteps }: DetailSidebarProps) {
  const stale = program.tanggalDiperiksa !== undefined && isStale(program.tanggalDiperiksa, today);
  const host = hostnameOf(program.sumberUtama.url) ?? program.sumberUtama.url;

  return (
    <aside>
      <div className="panel sticky-panel">
        <span className="category">{program.kategori}</span>
        <h3>Siapkan langkahmu.</h3>
        <p>Pelajari syarat dan langkahnya, lalu lanjutkan melalui kanal resmi.</p>
        <div className={`verify-box ${program.verifikasi}`}>
          <VerifikasiBadge tingkat={program.verifikasi} />
          <span className="when">
            {program.tanggalDiperiksa
              ? `Diperiksa ${formatDate(program.tanggalDiperiksa)}`
              : 'Belum diperiksa'}
          </span>
        </div>
        {stale && (
          <p className="small-note">
            Pemeriksaan terakhir sudah lama; informasi mungkin sudah berubah.
          </p>
        )}
        {program.berkas && (
          <Link className="button full" href={berkasPath(program)}>
            Siapkan berkasmu <FileCheck size={17} />
          </Link>
        )}
        <button
          className={program.berkas ? 'button secondary full' : 'button full'}
          onClick={onShowSteps}
        >
          Lihat cara mengajukan <ArrowUpRight size={17} />
        </button>
        <OfficialSiteLink url={program.sumberUtama.url} className="button secondary full" />
        <small>Sumber: {host}. HAKKITA tidak mengajukan permohonan atas namamu.</small>
      </div>
    </aside>
  );
}
