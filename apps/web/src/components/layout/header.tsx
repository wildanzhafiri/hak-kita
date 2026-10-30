'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useRef, useState } from 'react';
import { Bookmark, Menu, Search, X } from 'lucide-react';
import { Logo } from './logo';
import { SearchDialog } from './search-dialog';
import { ServicesMenu } from './services-menu';

function activeClass(isActive: boolean): string | undefined {
  return isActive ? 'nav-active' : undefined;
}

export function Header() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const searchButtonRef = useRef<HTMLButtonElement>(null);

  return (
    <>
      <header className="header-shell">
        <div className="nav container">
          <Logo />
          <nav
            className={mobileOpen ? 'nav-links mobile-open' : 'nav-links'}
            aria-label="Navigasi utama"
            onClick={(e) => {
              if (e.target instanceof Element && e.target.closest('a')) setMobileOpen(false);
            }}
          >
            <Link className={activeClass(pathname === '/')} href="/">
              Beranda
            </Link>
            <ServicesMenu pathname={pathname} />
            <Link
              className={activeClass(pathname.startsWith('/awasi-uang-publik'))}
              href="/awasi-uang-publik"
            >
              Awasi Uang Publik
            </Link>
            <Link className={activeClass(pathname === '/tentang')} href="/tentang">
              Tentang HAKKITA
            </Link>
          </nav>
          <div className="nav-actions">
            <button
              ref={searchButtonRef}
              className="icon-button nav-search"
              aria-label="Buka pencarian"
              onClick={() => setSearchOpen(true)}
            >
              <Search size={19} />
            </button>
            <Link className="plan-button" href="/rencanaku">
              <Bookmark size={16} />
              <span>Rencanaku</span>
            </Link>
            <button
              className="icon-button mobile-toggle"
              aria-label={mobileOpen ? 'Tutup menu' : 'Buka menu'}
              aria-expanded={mobileOpen}
              onClick={() => setMobileOpen(!mobileOpen)}
            >
              {mobileOpen ? <X /> : <Menu />}
            </button>
          </div>
        </div>
      </header>
      <SearchDialog
        open={searchOpen}
        onClose={() => setSearchOpen(false)}
        returnFocusRef={searchButtonRef}
      />
    </>
  );
}
