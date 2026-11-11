'use client';

import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { useAuth } from '@/hooks/use-auth';
import { AccountGate } from './account-gate';
import { ACCOUNT_GATE_COPY, WELCOME_COPY as COPY } from './content';

export function WelcomePage() {
  const { user, isReady } = useAuth();

  if (!isReady) return null;
  if (!user) return <AccountGate next="/selamat-datang" title={ACCOUNT_GATE_COPY.welcomeTitle} />;

  return (
    <div className="flex flex-wrap items-center gap-3">
      <Link className="button" href="/profil/edit">
        {COPY.complete}
        <ArrowRight aria-hidden="true" size={18} />
      </Link>
      <Link className="button secondary" href="/kenali-hakmu">
        {COPY.explore}
      </Link>
    </div>
  );
}
