'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog } from '@/components/ui/dialog';
import { getSupabaseBrowserClient } from '@/lib/supabase/client';
import { useAuth } from '@/hooks/use-auth';
import { SIGN_OUT_DIALOG_DESCRIPTION, SIGN_OUT_DIALOG_TITLE, SIGN_OUT_FAILURE_COPY } from './content';
import type { AuthNavActionProps } from './types';

export function AuthNavAction({ currentPath }: AuthNavActionProps) {
  const router = useRouter();
  const { user } = useAuth();
  const [isConfirming, setIsConfirming] = useState(false);
  const [isSigningOut, setIsSigningOut] = useState(false);
  const [hasSignOutFailed, setHasSignOutFailed] = useState(false);

  if (!user) {
    const search = new URLSearchParams({ next: currentPath });
    return (
      <Link className="nav-login" href={`/masuk?${search.toString()}`}>
        Masuk
      </Link>
    );
  }

  async function handleSignOut() {
    setIsSigningOut(true);
    setHasSignOutFailed(false);
    try {
      const client = getSupabaseBrowserClient();
      if (!client) {
        setHasSignOutFailed(true);
        return;
      }

      const { error } = await client.auth.signOut();
      if (error) {
        setHasSignOutFailed(true);
        return;
      }

      router.replace('/');
      router.refresh();
    } catch {
      setHasSignOutFailed(true);
    } finally {
      setIsSigningOut(false);
    }
  }

  return (
    <Dialog
      closeLabel="Tutup konfirmasi keluar"
      description={SIGN_OUT_DIALOG_DESCRIPTION}
      onOpenChange={(open) => {
        if (!isSigningOut) setIsConfirming(open);
      }}
      open={isConfirming}
      title={SIGN_OUT_DIALOG_TITLE}
      trigger={
        <button
          className="nav-login border-0 bg-transparent p-0 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#196dcc]"
          onClick={() => {
            setHasSignOutFailed(false);
            setIsConfirming(true);
          }}
          type="button"
        >
          Keluar
        </button>
      }
    >
      <div className="flex gap-3">
        <Button
          className="flex-1"
          isDisabled={isSigningOut}
          onPress={() => setIsConfirming(false)}
          tone="secondary"
        >
          Batal
        </Button>
        <Button className="flex-1" isDisabled={isSigningOut} onPress={handleSignOut}>
          {isSigningOut ? 'Sedang keluar…' : 'Ya, keluar'}
        </Button>
      </div>
      {hasSignOutFailed && (
        <p className="mt-4 text-sm text-[#b72f35]" role="alert">
          {SIGN_OUT_FAILURE_COPY}
        </p>
      )}
    </Dialog>
  );
}
