import { Printer, Trash } from 'lucide-react';
import { OfficialSiteLink } from '@/components/program/official-site-link';
import { Button } from '@/components/ui/button';
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
        <Button className="w-full" onPress={() => window.print()}>
          Cetak atau simpan PDF <Printer size={17} />
        </Button>
        <OfficialSiteLink url={program.sumberUtama.url} className="button secondary full" />
        <Button tone="quiet" onPress={onReset}>
          <Trash size={14} /> Hapus isian dari perangkat ini
        </Button>
        <small>{PRIVACY_NOTE}</small>
      </div>
    </aside>
  );
}
