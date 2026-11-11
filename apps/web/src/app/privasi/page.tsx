import type { Metadata } from 'next';
import { Breadcrumbs } from '@/components/ui/breadcrumbs';
import { PRIVACY_PAGE_CONTENT } from './content';

export const metadata: Metadata = {
  title: 'Privasi',
  description: PRIVACY_PAGE_CONTENT.description,
};

export default function PrivasiPage() {
  return (
    <div className="bg-white">
      <div className="container">
        <div className="mx-auto max-w-[850px]">
          <Breadcrumbs
            items={[{ label: 'Beranda', href: '/' }, { label: 'Privasi' }]}
            label="Jejak navigasi"
          />
          <header className="pb-8 pt-[26px] max-[700px]:pb-[27px] max-[700px]:pt-[17px]">
            <h1 className="m-0 max-w-[900px] text-[32px] font-bold capitalize leading-[1.22] tracking-[-0.025em] text-[#292b2e]">
              {PRIVACY_PAGE_CONTENT.title}
            </h1>
            <p className="mb-0 mt-[17px] text-base leading-[1.65] text-[#555c64] max-[700px]:mt-3.5 max-[700px]:text-[13px]">
              {PRIVACY_PAGE_CONTENT.description}
            </p>
          </header>
          <div className="max-w-[790px] pb-[55px]">
            {PRIVACY_PAGE_CONTENT.sections.map((section) => (
              <section key={section.heading}>
                <h2 className="mb-[15px] mt-[35px] text-[24px] font-bold capitalize leading-[1.3] tracking-[-0.025em] text-[#292b2e] max-[640px]:text-[22px]">
                  {section.heading}
                </h2>
                <p className="mb-[18px] mt-0 text-[15px] leading-[1.9] text-[#555c64] max-[640px]:text-[13px]">
                  {section.body}
                </p>
              </section>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
