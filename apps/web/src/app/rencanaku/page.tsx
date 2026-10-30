import type { Metadata } from 'next';
import { ComingSoon } from '@/components/layout/coming-soon';

export const metadata: Metadata = { title: 'Rencanaku' };

export default function RencanakuPage() {
  return (
    <ComingSoon
      breadcrumbs={[{ label: 'Rencanaku' }]}
      eyebrow="HAK KITA, UNTUK KITA"
      title="Simpan pilihan, siapkan langkahmu."
      description="Kelola program dan layanan yang ingin kamu lanjutkan."
      body="Kamu akan bisa menyimpan program dan layanan, menyusun langkah pengurusan, dan menandai yang sudah selesai."
      points={[
        'Simpan program dan layanan',
        'Checklist syarat dan dokumen',
        'Tenggat dan periode pendaftaran',
      ]}
      action={{ href: '/kenali-hakmu', label: 'Temukan program' }}
    />
  );
}
