'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog } from '@/components/ui/dialog';
import { getSupabaseBrowserClient } from '@/lib/supabase/client';
import {
  SIGN_OUT_DIALOG_DESCRIPTION,
  SIGN_OUT_DIALOG_TITLE,
  SIGN_OUT_FAILURE_COPY,
} from './content';
import type { SignOutDialogProps } from './types';

export function SignOutDialog({ renderTrigger, isOpen, onOpenChange }: SignOutDialogProps) {
  const router = useRouter();
  const [isConfirmingInternal, setIsConfirmingInternal] = useState(false);
  const isConfirming = isOpen ?? isConfirmingInternal;
  function setIsConfirming(value: boolean) {
    setIsConfirmingInternal(value);
    onOpenChange?.(value);
  }
  const [isSigningOut, setIsSigningOut] = useState(false);
  const [hasSignOutFailed, setHasSignOutFailed] = useState(false);

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
        renderTrigger?.(() => {
          setHasSignOutFailed(false);
          setIsConfirming(true);
        }) ?? null
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
