import type { Metadata } from 'next';
import { PageShell } from '@/components/layout/page-shell';
import { ButtonLink } from '@/components/ui/button-link';
import { Eyebrow } from '@/components/ui/eyebrow';
import { PRIVACY_POINTS } from './content';

export const metadata: Metadata = {
  title: 'Tentang HAKKITA',
  description:
    'Informasi publik yang mudah dipahami membantu setiap orang mengambil langkah yang lebih baik.',
};

export default function TentangPage() {
  return (
    <PageShell
      breadcrumbs={[{ label: 'Tentang HAKKITA' }]}
      eyebrow="TENTANG HAKKITA"
      title="Hak kita. Peluang kita. Masa depan kita."
      description="Kami percaya informasi publik yang mudah dipahami membantu setiap orang mengambil langkah yang lebih baik."
    >
      <div className="reading">
        <section className="panel">
          <Eyebrow>TENTANG HAKKITA</Eyebrow>
          <h2>Informasi yang lebih dekat dengan kehidupan.</h2>
          <p>
            HAKKITA menyatukan pencarian program, panduan layanan, dan informasi anggaran dalam
            pengalaman yang ramah dan mudah dipahami. Setiap informasi ditampilkan bersama sumber
            resminya, tanggal pemeriksaannya, dan tingkat verifikasinya.
          </p>
          <p>
            Tujuannya sederhana: membantu kamu memahami pilihan, menyiapkan kebutuhan, dan tahu
            langkah berikutnya melalui kanal resmi. HAKKITA bukan layanan resmi pemerintah dan tidak
            menentukan siapa yang berhak menerima suatu program.
          </p>
        </section>
        <section id="privasi" className="panel">
          <h2>Privasi yang mudah dipahami.</h2>
          <ul className="prose-list">
            {PRIVACY_POINTS.map((point) => (
              <li key={point}>{point}</li>
            ))}
          </ul>
          <ButtonLink href="/sumber-data" secondary>
            Pelajari sumber & batasan data
          </ButtonLink>
        </section>
      </div>
    </PageShell>
  );
}
