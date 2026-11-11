import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { PageShell } from '@/components/layout/page-shell';
import { FaqAccordion } from '@/components/ui/faq-accordion';
import { BANTUAN_FAQ_ITEMS, BANTUAN_PAGE_CONTENT } from './content';

export const metadata: Metadata = {
  title: 'Pusat Bantuan',
  description: BANTUAN_PAGE_CONTENT.description,
};

export default function BantuanPage() {
  return (
    <PageShell
      breadcrumbs={[{ label: 'Pusat Bantuan' }]}
      narrow
      title={BANTUAN_PAGE_CONTENT.title}
      description={BANTUAN_PAGE_CONTENT.description}
    >
      <FaqAccordion items={BANTUAN_FAQ_ITEMS} />
      <Link
        className="mt-8 inline-flex min-h-11 items-center gap-2 text-[15px] font-semibold text-[#196dcc] underline-offset-4 hover:underline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#196dcc]"
        href="/program"
      >
        {BANTUAN_PAGE_CONTENT.browseLink}
        <ArrowRight aria-hidden="true" size={18} />
      </Link>
    </PageShell>
  );
}
