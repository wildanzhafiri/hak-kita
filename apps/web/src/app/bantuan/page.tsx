import type { Metadata } from 'next';
import { FaqAccordion } from '@/components/ui/faq-accordion';
import { PageShell } from '@/components/layout/page-shell';
import { HOME_FAQ_ITEMS } from '@/features/home/content';

const DESCRIPTION = 'Jawaban tentang HAKKITA, informasi program, dan panduan layanan publik.';

export const metadata: Metadata = { title: 'Pusat Bantuan', description: DESCRIPTION };

export default function BantuanPage() {
  return (
    <PageShell
      breadcrumbs={[{ label: 'Pusat Bantuan' }]}
      eyebrow="BANTUAN HAKKITA"
      title="Pertanyaan yang sering diajukan"
      description={DESCRIPTION}
    >
      <div className="max-w-[850px] py-8 max-[700px]:py-5">
        <FaqAccordion items={HOME_FAQ_ITEMS} />
      </div>
    </PageShell>
  );
}
