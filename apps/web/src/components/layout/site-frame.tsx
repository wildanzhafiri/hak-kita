'use client';

import { usePathname } from 'next/navigation';
import type { SiteFrameProps } from './types';

export function SiteFrame({ header, footer, children }: SiteFrameProps) {
  const pathname = usePathname();
  const isRencanaku = pathname === '/rencanaku' || pathname.startsWith('/rencanaku/');

  return (
    <>
      <a href="#main" className="skip-link">
        Lewati ke konten
      </a>
      {!isRencanaku && header}
      <main id="main">{children}</main>
      {!isRencanaku && footer}
    </>
  );
}
