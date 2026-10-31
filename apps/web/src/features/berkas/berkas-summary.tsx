import { Printer, Trash2 } from 'lucide-react';
import { formatDate } from '@hakkita/domain';
import { OfficialSiteLink } from '@/components/program/official-site-link';
import { VerifikasiBadge } from '@/components/program/verifikasi-badge';
import { ProgressMeter } from '@/components/ui/progress-meter';
import { PRIVACY_NOTE } from './constants';
import type { BerkasSummaryProps } from './types';

export function BerkasSummary({ program, readiness, onReset }: BerkasSummaryProps) {
  return (
    <aside className="no-print">
      <div className="panel sticky-panel">
        <span className="category">{program.kategori}</span>
        <h3>Berkas siap bawa</h3>
        <ProgressMeter
          value={readiness.ready}
          max={readiness.total}
          summary={`${readiness.ready} dari ${readiness.total} dokumen siap`}
          label="Kesiapan berkas"
        />
        <div className={`verify-box ${program.verifikasi}`}>
          <VerifikasiBadge tingkat={program.verifikasi} />
          <span className="when">
            {program.tanggalDiperiksa
              ? `Diperiksa ${formatDate(program.tanggalDiperiksa)}`
              : 'Belum diperiksa'}
          </span>
        </div>
        <button className="button full" onClick={() => window.print()}>
          Cetak atau simpan PDF <Printer size={17} />
        </button>
        <OfficialSiteLink url={program.sumberUtama.url} className="button secondary full" />
        <button className="text-button" onClick={onReset}>
          <Trash2 size={14} /> Hapus isian dari perangkat ini
        </button>
        <small>{PRIVACY_NOTE}</small>
      </div>
    </aside>
  );
}
