import { formatDate } from '@hakkita/domain';
import type { BerkasPrintHeaderProps } from './types';

export function BerkasPrintHeader({ program, today }: BerkasPrintHeaderProps) {
  return (
    <div className="print-only">
      <h2>Berkas siap bawa: {program.nama}</h2>
      <p>
        Disusun di HAKKITA pada {formatDate(today)}. Ini lembar persiapan pribadi, bukan dokumen
        resmi. Ketentuan terbaru ada di {program.sumberUtama.url}
      </p>
    </div>
  );
}
