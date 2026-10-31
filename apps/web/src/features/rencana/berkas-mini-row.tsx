import Link from 'next/link';
import { berkasPath } from '@hakkita/domain';
import { ProgressMeter } from '@/components/ui/progress-meter';
import type { BerkasMiniRowProps } from './types';

export function BerkasMiniRow({ entry }: BerkasMiniRowProps) {
  const { program, readiness } = entry;
  return (
    <li className="mini-row">
      <Link href={berkasPath(program)}>{program.nama}</Link>
      <ProgressMeter
        value={readiness.ready}
        max={readiness.total}
        summary={`${readiness.ready} dari ${readiness.total} dokumen siap`}
        label={`Kesiapan berkas ${program.nama}`}
      />
    </li>
  );
}
