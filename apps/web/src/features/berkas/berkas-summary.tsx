import { Printer, Trash2 } from 'lucide-react';
import { formatDate } from '@hakkita/domain';
import { OfficialSiteLink } from '@/components/program/official-site-link';
import { VerifikasiBadge } from '@/components/program/verifikasi-badge';
import { PRIVACY_NOTE } from './constants';
import type { BerkasSummaryProps } from './types';

export function BerkasSummary({ program, readiness, onReset }: BerkasSummaryProps) {
  const percent = readiness.total === 0 ? 0 : Math.round((readiness.ready / readiness.total) * 100);
  return (
    <aside className="no-print">
      <div className="panel sticky-panel">
        <span className="category">{program.kategori}</span>
        <h3>Berkas siap bawa</h3>
        <div className="wizard-progress">
          <span>
            {readiness.ready} dari {readiness.total} dokumen siap
          </span>
          <span>{percent}%</span>
        </div>
        <div
          className="progress-track"
          role="progressbar"
          aria-label="Kesiapan berkas"
          aria-valuemin={0}
          aria-valuemax={readiness.total}
          aria-valuenow={readiness.ready}
        >
          <span style={{ width: `${percent}%` }} />
        </div>
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
