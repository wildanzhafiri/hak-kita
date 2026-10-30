import type { Metadata } from 'next';
import { ComingSoon } from '@/components/layout/coming-soon';

export const metadata: Metadata = { title: 'Awasi Uang Publik' };

export default function AwasiUangPublikPage() {
  return (
    <ComingSoon
      breadcrumbs={[{ label: 'Awasi Uang Publik' }]}
      eyebrow="AWASI UANG PUBLIK"
      title="Pahami ke mana uang publik digunakan."
      description="Telusuri anggaran, realisasi belanja, dan prioritas penggunaan dana dalam visualisasi yang mudah dipahami."
      body="Angka anggaran hanya akan ditampilkan bersama sumber, cakupan, dan periodenya, dan dihubungkan ke program hanya bila ada dokumen yang menunjukkan kaitannya."
      points={[
        'Anggaran dan realisasi dengan sumber resmi',
        'Label hubungan: terhubung langsung, konteks sektor, atau belum tersedia',
        'Draf pertanyaan untuk instansi terkait',
      ]}
      action={{ href: '/sumber-data', label: 'Lihat sumber & batasan data' }}
    />
  );
}
