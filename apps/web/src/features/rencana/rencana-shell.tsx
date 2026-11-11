'use client';

import { usePathname } from 'next/navigation';
import { Breadcrumbs } from '@/components/ui/breadcrumbs';
import { useHydrated } from '@/hooks/use-hydrated';
import { RENCANA_PAGE_CONTENT } from './content';
import { useRencanaState } from './rencana-context';
import type { RencanaShellProps } from './types';

export function RencanaShell({ children }: RencanaShellProps) {
  const pathname = usePathname();
  const hydrated = useHydrated();
  const { savedIsLoading } = useRencanaState();
  const page =
    RENCANA_PAGE_CONTENT.find((entry) => entry.href === pathname) ?? RENCANA_PAGE_CONTENT[0];

  return (
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
          <div className="rencana-main !mt-0">
            {hydrated ? (
              <>
                {savedIsLoading && (
                  <p className="small-note" aria-live="polite">
                    Memuat simpanan dari akunmu
                  </p>
                )}
                {children}
              </>
            ) : (
              <p className="small-note" aria-live="polite">
                Memuat rencanamu
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
