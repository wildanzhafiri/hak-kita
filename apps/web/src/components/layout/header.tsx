'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Bookmark } from 'lucide-react';
import { AuthNavAction } from './auth-nav-action';
import { MAIN_NAVIGATION } from './constants';
import { Logo } from './logo';
import { MobileNavigation } from './mobile-navigation';
import { isCurrentPath } from './navigation';
import type { HeaderProps } from './types';

export function Header({ accountMenu }: HeaderProps) {
  const pathname = usePathname();

  return (
    <header className="header-shell">
      <div className="nav container">
        <Logo />
        <MobileNavigation pathname={pathname} />
        <nav id="main-navigation" className="nav-links" aria-label="Navigasi utama">
          <div className="header-main-nav">
            {MAIN_NAVIGATION.map(({ href, label }) => (
              <Link
                aria-current={isCurrentPath(pathname, href) ? 'page' : undefined}
                className={isCurrentPath(pathname, href) ? 'nav-active' : undefined}
                href={href}
                key={href}
              >
                {label}
              </Link>
            ))}
          </div>
          <div className="nav-actions">
            <Link
              aria-current={isCurrentPath(pathname, '/rencanaku') ? 'page' : undefined}
              className="ml-1 inline-flex h-11 min-h-11 shrink-0 items-center gap-2 whitespace-nowrap rounded-[7px] border border-[#d8e4f2] bg-white px-[15px] text-xs font-medium text-[#1769c2] transition-colors hover:bg-[#f5f8fc] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1769c2]"
              href="/rencanaku"
            >
              <Bookmark aria-hidden="true" size={18} />
              <span>Rencanaku</span>
            </Link>
            <AuthNavAction accountMenu={accountMenu} currentPath={pathname} />
          </div>
        </nav>
      </div>
    </header>
  );
}
