import type { Metadata } from 'next';
import { ShieldCheck } from 'lucide-react';
import { PageShell } from '@/components/layout/page-shell';
import { loadPublishedInformation } from '@/server/data';
import { SOURCE_PAGE_CONTENT } from './content';
import { SourceInformationList } from './source-information-list';
import type { SourceInformationEntry } from './types';

export const metadata: Metadata = {
  title: 'Sumber Informasi',
  description: SOURCE_PAGE_CONTENT.description,
};

export default async function SumberDataPage() {
  const information = await loadPublishedInformation();
  const entries: SourceInformationEntry[] = information
    .map((item) => ({
      id: item.id,
      name: item.nama,
      agency: item.penyelenggara,
      checkedAt: item.tanggalDiperiksa ?? null,
      sourceUrl: item.sumberUtama.url,
    }))
    .sort((a, b) => a.name.localeCompare(b.name, 'id'));

  return (
    <PageShell
      breadcrumbs={[{ label: 'Sumber Informasi' }]}
      title={SOURCE_PAGE_CONTENT.title}
      description={SOURCE_PAGE_CONTENT.subtitle}
    >
      <div className="flex items-start gap-4 rounded-[9px] bg-[#f1f6fc] px-5 py-5 text-[#6383ad] sm:gap-4 sm:px-[22px] sm:py-[22px]">
        <ShieldCheck aria-hidden="true" className="mt-0.5 shrink-0" size={23} />
        <p className="max-w-[78ch] text-sm leading-[1.8]">{SOURCE_PAGE_CONTENT.notice}</p>
      </div>

      <SourceInformationList entries={entries} />

      <div className="mt-9 max-w-[790px] border-t border-[#e1e9f2] pt-7">
        <section aria-labelledby="source-method-title">
          <h2
            id="source-method-title"
            className="text-[clamp(21px,2.4vw,24px)] font-semibold leading-[1.35] tracking-[-.02em] text-[#253044]"
          >
            {SOURCE_PAGE_CONTENT.methodologyTitle}
          </h2>
          <p className="mt-3 text-sm leading-[1.85] text-[#617087] sm:text-[15px]">
            {SOURCE_PAGE_CONTENT.methodology}
          </p>
        </section>

        <section aria-labelledby="source-budget-title" className="mt-7">
          <h2
            id="source-budget-title"
            className="text-[clamp(21px,2.4vw,24px)] font-semibold leading-[1.35] tracking-[-.02em] text-[#253044]"
          >
            {SOURCE_PAGE_CONTENT.budgetTitle}
          </h2>
          <p className="mt-3 text-sm leading-[1.85] text-[#617087] sm:text-[15px]">
            {SOURCE_PAGE_CONTENT.budget}
          </p>
        </section>
      </div>
    </PageShell>
  );
}
