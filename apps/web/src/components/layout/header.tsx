'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useRef, useState } from 'react';
import { Bookmark, Menu, X } from 'lucide-react';
import { Button } from '../ui/button';
import { Logo } from './logo';

const NAVIGATION = [
  { href: '/', label: 'Beranda' },
  { href: '/program', label: 'Kenali Hakmu' },
  { href: '/layanan', label: 'Layanan Publik' },
  { href: '/anggaran', label: 'Telusuri Anggaran' },
] as const;

function isCurrentPath(pathname: string, href: string): boolean {
  if (href === '/') return pathname === '/';
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function Header() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const menuButtonRef = useRef<HTMLButtonElement>(null);

  return (
    <header className="header-shell">
      <div className="nav container">
        <Logo />
        <Button
          ref={menuButtonRef}
          className="mobile-toggle"
          tone="icon"
          aria-label={mobileOpen ? 'Tutup navigasi' : 'Buka navigasi'}
          aria-expanded={mobileOpen}
          aria-controls="main-navigation"
          onPress={() => setMobileOpen(!mobileOpen)}
        >
          {mobileOpen ? <X size={21} /> : <Menu size={21} />}
        </Button>
        <nav
          id="main-navigation"
          className={mobileOpen ? 'nav-links mobile-open' : 'nav-links'}
          aria-label="Navigasi utama"
          onClick={(event) => {
            if (event.target instanceof Element && event.target.closest('a')) setMobileOpen(false);
          }}
          onKeyDown={(event) => {
            if (event.key === 'Escape') {
              setMobileOpen(false);
              menuButtonRef.current?.focus();
            }
          }}
        >
          <div className="header-main-nav">
            {NAVIGATION.map(({ href, label }) => (
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
            <Link className="nav-login" href="/masuk">
              Masuk
            </Link>
          </div>
        </nav>
      </div>
    </header>
  );
}
