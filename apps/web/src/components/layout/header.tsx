'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Bookmark } from 'lucide-react';
import { AuthNavAction } from './auth-nav-action';
import { MAIN_NAVIGATION } from './constants';
import { Logo } from './logo';
import { MobileNavigation } from './mobile-navigation';
import { isCurrentPath } from './navigation';

export function Header() {
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
            <Link className="plan-button" href="/rencanaku">
              <Bookmark size={16} />
              <span>Rencanaku</span>
            </Link>
            <AuthNavAction currentPath={pathname} />
          </div>
        </nav>
      </div>
    </header>
  );
}
