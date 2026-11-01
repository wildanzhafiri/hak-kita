import type { Metadata } from 'next';
import { ComingSoon } from '@/components/layout/coming-soon';

export const metadata: Metadata = { title: 'Pantau Langkahmu' };

export default function PantauLangkahmuPage() {
  return (
    <ComingSoon
      breadcrumbs={[{ label: 'Pantau Langkahmu' }]}
      eyebrow="PANTAU LANGKAHMU"
      title="Lihat di mana prosesnya sering tersendat."
      description="Tandai langkah pengurusanmu dan lihat hambatan yang paling sering dialami warga di daerahmu."
      body="Laporan hambatan bersifat opsional dan anonim, dan hanya ditampilkan bila jumlahnya cukup banyak sehingga tidak bisa dilacak ke satu orang."
      points={[
        'Tandai langkah: lancar, macet, atau ditolak',
        'Ringkasan hambatan per wilayah',
        'Jalur lanjut ke kanal pengaduan resmi',
      ]}
      action={{ href: '/layanan', label: 'Lihat panduan layanan' }}
    />
  );
}
