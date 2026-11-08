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
      <div className="grid gap-12 py-8 max-[700px]:gap-9 max-[700px]:py-5">
        <section aria-labelledby="faq-heading" className="max-w-[850px]">
          <h2 className="mb-3 text-xl font-semibold tracking-tight text-[#25354b]" id="faq-heading">
            Pertanyaan yang sering diajukan
          </h2>
          <FaqAccordion items={HOME_FAQ_ITEMS} />
        </section>
      </div>
    </PageShell>
  );
}
