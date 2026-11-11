'use client';

import Link from 'next/link';
import { useState } from 'react';
import { ChevronDown, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Popover } from '@/components/ui/popover';
import { useAuth } from '@/hooks/use-auth';
import { SignOutDialog } from '@/components/layout/sign-out-dialog';
import { AccountAvatar } from './account-avatar';
import { ACCOUNT_MENU_COPY as COPY } from './content';
import { profileDisplayName } from './profile-initials';
import { useProfile } from './use-profile';

const MENU_LINK_CLASSES =
  'flex min-h-[42px] items-center rounded-lg px-3 py-2.5 text-sm text-[#25354b] transition-colors hover:bg-[#edf5ff] hover:text-[#1769c2] focus-visible:bg-[#edf5ff] focus-visible:text-[#1769c2] focus-visible:outline-none motion-reduce:transition-none';

export function AccountMenu() {
  const { user } = useAuth();
  const { nama } = useProfile();
  const [isOpen, setIsOpen] = useState(false);
  const [isSigningOutOpen, setIsSigningOutOpen] = useState(false);
  const email = user?.email ?? '';

  return (
    <>
      <Popover
        className="w-[290px] p-3"
        label={COPY.label}
        placement="bottom end"
        onOpenChange={setIsOpen}
        open={isOpen}
        trigger={
          <Button
            aria-label={COPY.label}
            className="min-h-0 gap-1 rounded-full p-0.5 pr-2"
            tone="quiet"
          >
            <AccountAvatar email={email} nama={nama} size="sm" />
            <ChevronDown aria-hidden="true" size={13} />
          </Button>
        }
      >
        <div className="flex items-center gap-3 border-b border-[#e1e7ee] pb-4">
          <AccountAvatar email={email} nama={nama} size="md" />
          <div className="min-w-0">
            <p className="m-0 text-sm font-semibold text-[#1b304c] [overflow-wrap:anywhere]">
              {profileDisplayName(nama, email)}
            </p>
            {nama.trim() && (
              <p className="m-0 mt-0.5 text-xs text-[#687385] [overflow-wrap:anywhere]">{email}</p>
            )}
          </div>
        </div>
        <nav className="flex flex-col border-b border-[#e1e7ee] py-2">
          <Link className={MENU_LINK_CLASSES} href="/profil" onClick={() => setIsOpen(false)}>
            {COPY.profile}
          </Link>
          <Link className={MENU_LINK_CLASSES} href="/rencanaku" onClick={() => setIsOpen(false)}>
            {COPY.plan}
          </Link>
        </nav>
        <button
          className="mt-1.5 flex min-h-[42px] w-full items-center justify-between rounded-lg px-3 py-2.5 text-sm text-[#b4232d] transition-colors hover:bg-[#fff0f0] focus-visible:bg-[#fff0f0] focus-visible:outline-none motion-reduce:transition-none"
          onClick={() => {
            setIsOpen(false);
            setIsSigningOutOpen(true);
          }}
          type="button"
        >
          {COPY.signOut}
          <LogOut aria-hidden="true" size={17} />
        </button>
      </Popover>
      <SignOutDialog isOpen={isSigningOutOpen} onOpenChange={setIsSigningOutOpen} />
    </>
  );
}
