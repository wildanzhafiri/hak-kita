'use client';

import { usePathname } from 'next/navigation';
import { AuthHeader } from './auth-header';
import { AUTH_ROUTE_PATHS, FOOTER_HIDDEN_PATHS } from './constants';
import type { SiteFrameProps } from './types';

export function SiteFrame({ header, footer, children }: SiteFrameProps) {
  const pathname = usePathname();
  const isAdmin = pathname.startsWith('/admin');
  const isAuth = AUTH_ROUTE_PATHS.some((path) => path === pathname);
  const isPublicFrameHidden = isAdmin;
  const isFooterHidden = FOOTER_HIDDEN_PATHS.some((path) => path === pathname);

  return (
    <>
      <a href={isAdmin ? '#admin-main' : '#main'} className="skip-link">
        {isAdmin ? 'Lewati ke konten admin' : 'Lewati ke konten'}
      </a>
      {!isPublicFrameHidden && (isAuth ? <AuthHeader /> : header)}
      {isAdmin ? (
        children
      ) : (
        <main
          className={
            isAuth
              ? 'min-h-[calc(100dvh-80px)] bg-white px-6 pb-10 pt-9 max-[640px]:min-h-[calc(100dvh-68px)] max-[640px]:px-5 max-[640px]:pb-8 max-[640px]:pt-7'
              : undefined
          }
          id="main"
        >
          {children}
        </main>
      )}
      {!isPublicFrameHidden && !isFooterHidden && !isAuth && footer}
    </>
  );
}
