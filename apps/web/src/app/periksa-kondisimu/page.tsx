import type { Metadata } from 'next';
import { ComingSoon } from '@/components/layout/coming-soon';

export const metadata: Metadata = { title: 'Periksa Kondisimu' };

export default function PeriksaKondisimuPage() {
  return (
    <ComingSoon
      breadcrumbs={[{ label: 'Periksa Kondisimu' }]}
      eyebrow="PERIKSA KONDISIMU"
      title="Pahami kondisi kesejahteraan keluargamu."
      description="Tinjau kondisi sosial ekonomi, ketahui cara memeriksa desil, dan siapkan pembaruan data jika diperlukan."
      body="Di sini kamu akan menemukan panduan memeriksa desil lewat kanal resmi dan langkah memperbarui data bila ada yang tidak sesuai. HAKKITA tidak menghitung desil dan tidak meminta NIK."
      points={[
        'Panduan cek desil melalui kanal pemerintah',
        'Langkah pemutakhiran data keluarga',
        'Ringkasan kondisi yang bisa kamu bawa ke petugas',
      ]}
      action={{ href: '/kenali-hakmu', label: 'Jelajahi program' }}
    />
  );
}
