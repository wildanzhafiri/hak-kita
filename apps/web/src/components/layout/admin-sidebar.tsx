'use client';

import Link from 'next/link';
import { LogOut, ShieldCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Logo } from './logo';
import { ADMIN_NAVIGATION } from './content';
import { ADMIN_NAVIGATION_ICONS } from './constants';
import type { AdminSidebarProps } from './types';

export function AdminSidebar({
  activeSection,
  adminEmail,
  isSigningOut,
  signOutError,
  onNavigate,
  onSignOut,
}: AdminSidebarProps) {
  return (
    <div className="flex h-full min-h-0 flex-col overflow-y-auto px-4 py-6">
      <div className="border-b border-[#e3e9f0] px-3 pb-5">
        <Logo />
      </div>

      <nav aria-label="Navigasi admin" className="flex-1 py-5">
        <div className="flex flex-col gap-1.5">
          {ADMIN_NAVIGATION.map((item) => {
            const Icon = ADMIN_NAVIGATION_ICONS[item.icon];
            const isActive = activeSection === item.section;
            return (
              <Link
                aria-current={isActive ? 'page' : undefined}
                className={
                  isActive
                    ? 'flex min-h-12 items-center gap-2.5 rounded-lg border border-[#d6e5f5] bg-[#eef5fc] px-3.5 text-sm font-semibold text-[#196dcc] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#196dcc]'
                    : 'flex min-h-12 items-center gap-2.5 rounded-lg px-3.5 text-sm font-medium text-[#46566b] transition-colors hover:bg-[#f5f8fc] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#196dcc] motion-reduce:transition-none'
                }
                href={item.href}
                key={item.href}
                onClick={onNavigate}
              >
                <Icon aria-hidden="true" size={18} />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </div>
      </nav>

      <div className="border-t border-[#e3e9f0] pt-5">
        <div className="flex min-w-0 items-center gap-3 px-1">
          <span className="grid size-9 shrink-0 place-items-center rounded-full bg-[#eef5fc] text-[#196dcc]">
            <ShieldCheck aria-hidden="true" size={18} />
          </span>
          <span className="flex min-w-0 flex-col gap-0.5">
            <span className="text-sm font-semibold text-[#26364b]">Admin HAKKITA</span>
            <span className="truncate text-xs text-[#718096]">{adminEmail}</span>
          </span>
        </div>
        <Button
          className="mt-4 w-full justify-start"
          isDisabled={isSigningOut}
          onPress={onSignOut}
          tone="danger-outline"
        >
          <LogOut aria-hidden="true" size={17} />
          {isSigningOut ? 'Sedang keluar' : 'Keluar'}
        </Button>
        {signOutError && (
          <p className="mt-3 text-xs leading-5 text-[#b72f35]" role="alert">
            {signOutError}
          </p>
        )}
      </div>
    </div>
  );
}
