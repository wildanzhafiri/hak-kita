'use client';

import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import { Bookmark, Menu, X } from 'lucide-react';
import { Button } from '../ui/button';
import { AuthNavAction } from './auth-nav-action';
import { MAIN_NAVIGATION, MOBILE_PANEL_CLASSES, SHEET_ACTION_CLASSES } from './constants';
import { isCurrentPath } from './navigation';
import type { MobileNavigationProps } from './types';

export function MobileNavigation({ pathname }: MobileNavigationProps) {
  const [isOpen, setIsOpen] = useState(false);
  const toggleRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isOpen) return;

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key !== 'Escape') return;
      setIsOpen(false);
      toggleRef.current?.focus();
    }

    function handlePointerDown(event: PointerEvent) {
      if (!(event.target instanceof Node)) return;
      if (panelRef.current?.contains(event.target) || toggleRef.current?.contains(event.target)) {
        return;
      }
      setIsOpen(false);
    }

    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('pointerdown', handlePointerDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('pointerdown', handlePointerDown);
    };
  }, [isOpen]);

  return (
    <>
      <Button
        aria-controls="mobile-navigation"
        aria-expanded={isOpen}
        aria-label={isOpen ? 'Tutup navigasi' : 'Buka navigasi'}
        className="mobile-toggle"
        onPress={() => setIsOpen((value) => !value)}
        ref={toggleRef}
        tone="icon"
      >
        {isOpen ? <X aria-hidden="true" size={21} /> : <Menu aria-hidden="true" size={21} />}
      </Button>
      <div
        aria-hidden={!isOpen}
        className={`${MOBILE_PANEL_CLASSES.base} ${isOpen ? MOBILE_PANEL_CLASSES.open : MOBILE_PANEL_CLASSES.closed}`}
        id="mobile-navigation"
        inert={!isOpen}
        onClick={(event) => {
          if (event.target instanceof Element && event.target.closest('a')) setIsOpen(false);
        }}
        ref={panelRef}
      >
        <nav aria-label="Menu navigasi" className="flex flex-col gap-1 px-5 pt-3">
          {MAIN_NAVIGATION.map(({ href, label }) => {
            const isCurrent = isCurrentPath(pathname, href);
            return (
              <Link
                aria-current={isCurrent ? 'page' : undefined}
                className={
                  isCurrent
                    ? 'flex h-12 items-center rounded-xl bg-[#edf5ff] px-3.5 text-[15px] font-bold text-[#196dcc]'
                    : 'flex h-12 items-center rounded-xl px-3.5 text-[15px] font-medium text-[#25354b] transition-colors hover:bg-[#f3f8fe] motion-reduce:transition-none'
                }
                href={href}
                key={href}
              >
                {label}
              </Link>
            );
          })}
        </nav>
        <div className="flex gap-3 px-5 pb-5 pt-2">
          <Link className={SHEET_ACTION_CLASSES.secondary} href="/rencanaku">
            <Bookmark aria-hidden="true" size={17} />
            Rencanaku
          </Link>
          <AuthNavAction currentPath={pathname} variant="sheet" />
        </div>
      </div>
    </>
  );
}
