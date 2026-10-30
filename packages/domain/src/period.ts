import type { Periode } from '@hakkita/schema';
import { formatDate } from './date';
import type { PeriodStatus } from './types';

export function periodStatus(periode: Periode | undefined, today: string): PeriodStatus {
  if (periode === undefined) return 'tidak-diketahui';
  if (periode === 'sepanjang-tahun') return 'sepanjang-tahun';
  if (today < periode.buka) return 'belum-dibuka';
  if (today > periode.tutup) return 'ditutup';
  return 'dibuka';
}

export function periodLabel(periode: Periode | undefined, status: PeriodStatus): string {
  const range = typeof periode === 'object' ? periode : null;
  switch (status) {
    case 'dibuka':
      return range ? `Dibuka sampai ${formatDate(range.tutup)}` : 'Dibuka';
    case 'ditutup':
      return range ? `Ditutup ${formatDate(range.tutup)}` : 'Ditutup';
    case 'belum-dibuka':
      return range ? `Dibuka ${formatDate(range.buka)}` : 'Belum dibuka';
    case 'sepanjang-tahun':
      return 'Sepanjang tahun';
    case 'tidak-diketahui':
      return 'Periode: cek kanal resmi';
  }
}
