import Link from 'next/link';
import { ArrowRight, Trash } from 'lucide-react';
import { berkasPath, isBerkasComplete } from '@hakkita/domain';
import { OfficialSiteLink } from '@/components/program/official-site-link';
import { Button } from '@/components/ui/button';
import { ProgressMeter } from '@/components/ui/progress-meter';
import { COMPLETE_NOTE, UNANSWERED_NOTE } from './constants';
import type { RencanaItemProps } from './types';

export function RencanaItem({ entry, onClear }: RencanaItemProps) {
  const { program, note, readiness, hasUnanswered } = entry;
  const complete = isBerkasComplete(entry);
  const href = berkasPath(program);

  return (
    <li className="panel plan-item">
      <div className="plan-head">
        <div>
          <span className="category">{program.kategori}</span>
          <h3>
            <Link href={href}>{program.nama}</Link>
          </h3>
        </div>
      </div>
      <ProgressMeter
        value={readiness.ready}
        max={readiness.total}
        summary={`${readiness.ready} dari ${readiness.total} dokumen siap`}
        label={`Kesiapan berkas ${program.nama}`}
      />
      {hasUnanswered && <p className="small-note">{UNANSWERED_NOTE}</p>}
      {complete && <p className="small-note">{COMPLETE_NOTE}</p>}
      {note && <p className="plan-note">{note}</p>}
      <div className="plan-actions">
        {complete ? (
          <OfficialSiteLink url={program.sumberUtama.url} className="button" />
        ) : (
          <Link className="button" href={href}>
            Lanjutkan berkas <ArrowRight size={17} />
          </Link>
        )}
        <Button tone="quiet" onPress={onClear}>
          <Trash size={14} /> Hapus isian dari perangkat ini
        </Button>
      </div>
    </li>
  );
}
