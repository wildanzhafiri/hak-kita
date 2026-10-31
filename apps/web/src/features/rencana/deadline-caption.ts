import type { Deadline } from '@hakkita/domain';

export function deadlineCaption({ status, daysLeft }: Deadline): string {
  switch (status) {
    case 'dibuka':
      if (daysLeft === null) return 'Sedang dibuka';
      if (daysLeft <= 0) return 'Berakhir hari ini';
      return `${daysLeft} hari lagi`;
    case 'belum-dibuka':
      return 'Belum dibuka';
    case 'ditutup':
      return 'Sudah ditutup';
    case 'sepanjang-tahun':
      return 'Tanpa tenggat';
    case 'tidak-diketahui':
      return 'Cek kanal resmi';
  }
}
