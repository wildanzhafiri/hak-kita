'use client';

import { usePathname } from 'next/navigation';
import type { SiteFrameProps } from './types';

export function SiteFrame({ header, footer, children }: SiteFrameProps) {
  const pathname = usePathname();
  const isRencanaku = pathname === '/rencanaku' || pathname.startsWith('/rencanaku/');
  const isAdmin = pathname.startsWith('/admin');
  const isPublicFrameHidden = isRencanaku || isAdmin;

  return (
    <>
      <a href={isAdmin ? '#admin-main' : '#main'} className="skip-link">
        {isAdmin ? 'Lewati ke konten admin' : 'Lewati ke konten'}
      </a>
      {!isPublicFrameHidden && header}
      {isAdmin ? children : <main id="main">{children}</main>}
      {!isPublicFrameHidden && footer}
    </>
  );
}
