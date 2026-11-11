import { LoaderCircle } from 'lucide-react';
import { Breadcrumbs } from '@/components/ui/breadcrumbs';
import { RENCANA_LOADING_LABEL, RENCANA_PAGE_CONTENT } from './content';

export function RencanaLoading() {
  const [page] = RENCANA_PAGE_CONTENT;

  return (
    <div className="rencana-app">
      <div className="rencana-shell !grid !min-h-0 !grid-cols-1">
        <div className="rencana-workspace">
          <div className="rencana-content !w-full !max-w-[1100px] max-[900px]:!px-6 max-[640px]:!px-[18px]">
            <Breadcrumbs
              label="Jejak navigasi"
              items={[
                { label: 'Beranda', href: '/' },
                { label: 'Rencanaku', href: '/rencanaku' },
              ]}
            />
            <header className="rencana-intro !mb-7 !mt-5 max-[640px]:!mb-5">
              <h1 className="!max-w-none !text-[clamp(30px,3.4vw,42px)] !leading-[1.2] !tracking-[-0.035em] !text-[#1b304c] max-[700px]:!text-[32px]">
                {page.title}
              </h1>
              <p className="!mt-3 !max-w-[70ch] !text-[15px] !leading-[1.7] !text-[#617087] max-[700px]:!text-[13px]">
                {page.description}
              </p>
            </header>
            <div
              aria-busy="true"
              aria-live="polite"
              className="flex items-center gap-3 py-6 text-[15px] text-[#617087]"
              role="status"
            >
              <LoaderCircle
                aria-hidden="true"
                className="shrink-0 text-[#196dcc] motion-safe:animate-spin"
                size={22}
              />
              <span>{RENCANA_LOADING_LABEL}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
