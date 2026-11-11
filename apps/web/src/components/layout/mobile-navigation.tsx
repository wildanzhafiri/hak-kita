'use client';

import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import { Bookmark, LogOut, Menu, X } from 'lucide-react';
import { Button } from '../ui/button';
import { useAuth } from '@/hooks/use-auth';
import { AuthNavAction } from './auth-nav-action';
import { MAIN_NAVIGATION, MOBILE_PANEL_CLASSES, SHEET_ACTION_CLASSES } from './constants';
import { isCurrentPath } from './navigation';
import { SignOutDialog } from './sign-out-dialog';
import type { MobileNavigationProps } from './types';

const ACCOUNT_ROW_CLASSES =
  'flex h-12 items-center rounded-xl px-3.5 text-[15px] font-medium text-[#526173] transition-colors hover:bg-[#f3f8fe] hover:text-[#196dcc] motion-reduce:transition-none';

export function MobileNavigation({ pathname }: MobileNavigationProps) {
  const { user } = useAuth();
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
        {user ? (
          <nav aria-label="Menu akun" className="flex flex-col px-5 pb-4 pt-1">
            <Link className={ACCOUNT_ROW_CLASSES} href="/profil">
              Profil Saya
            </Link>
            <Link className={ACCOUNT_ROW_CLASSES} href="/rencanaku">
              Rencanaku
            </Link>
            <div className="mt-2 border-t border-[#e1e7ee] pt-2">
              <SignOutDialog
                renderTrigger={(openDialog) => (
                  <button
                    className="flex h-12 w-full items-center justify-between rounded-xl px-3.5 text-[15px] font-medium text-[#b4232d] transition-colors hover:bg-[#fff0f0] motion-reduce:transition-none"
                    onClick={openDialog}
                    type="button"
                  >
                    Keluar
                    <LogOut aria-hidden="true" size={18} />
                  </button>
                )}
              />
            </div>
          </nav>
        ) : (
          <div className="grid grid-cols-2 gap-3 px-5 pb-5 pt-2">
            <Link className={SHEET_ACTION_CLASSES.secondary} href="/rencanaku">
              <Bookmark aria-hidden="true" size={17} />
              Rencanaku
            </Link>
            <AuthNavAction currentPath={pathname} variant="sheet" />
          </div>
        )}
      </div>
    </>
  );
}
