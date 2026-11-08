'use client';

import Link from 'next/link';
import { getSupabaseBrowserClient } from '@/lib/supabase/client';
import { useAuth } from '@/hooks/use-auth';
import type { AuthNavActionProps } from './types';

export function AuthNavAction({ currentPath }: AuthNavActionProps) {
  const { user } = useAuth();
  if (!user) {
    const search = new URLSearchParams({ next: currentPath });
    return (
      <Link className="nav-login" href={`/masuk?${search.toString()}`}>
        Masuk
      </Link>
    );
  }

  async function handleSignOut() {
    const client = getSupabaseBrowserClient();
    await client?.auth.signOut();
  }

  return (
    <button
      className="nav-login border-0 bg-transparent p-0 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#196dcc]"
      onClick={handleSignOut}
      type="button"
    >
      Keluar
    </button>
  );
}
