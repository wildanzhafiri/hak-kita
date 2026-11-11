'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Bell, RotateCw } from 'lucide-react';
import { useState } from 'react';
import type { RencanaPreparationProps } from './types';
import { Button } from '@/components/ui/button';
import { Dialog } from '@/components/ui/dialog';
import { useEmailNotificationPreference } from '@/hooks/use-email-notification-preference';
import { useProgramFollows } from '@/hooks/use-program-follows';

export function RencanaEmailReminder({ program, isEmailAvailable }: RencanaPreparationProps) {
  const pathname = usePathname();
  const [isPromptOpen, setIsPromptOpen] = useState(false);
  const { enabled, isLoading: preferenceIsLoading, isSaving, error: preferenceError, setEnabled, retry } =
    useEmailNotificationPreference();
  const {
    rows,
    isLoading,
    busyProgramId,
    error,
    isSignedIn,
    isConfigured,
    follow,
    unfollow,
    retry: retryFollows,
  } = useProgramFollows();
  const isFollowing = rows.some((row) => row.program_id === program.id);
  const isActive = isFollowing && enabled;
  const isBusy = isLoading || preferenceIsLoading || isSaving || busyProgramId !== null;
  const params = new URLSearchParams({ next: pathname });
  const loginHref = `/masuk?${params.toString()}`;
  const signupHref = `/daftar?${params.toString()}`;
  const status = !isEmailAvailable
    ? 'Pengingat email belum tersedia saat ini.'
    : !isSignedIn
      ? 'Masuk untuk menerima kabar terbaru melalui email.'
      : isBusy
        ? 'Memuat status pengingat email.'
        : isActive
          ? 'Pengingat email aktif untuk program ini.'
          : 'Pengingat belum diaktifkan.';

  function handlePress() {
    if (!isSignedIn) {
      setIsPromptOpen(true);
      return;
    }
    if (!isEmailAvailable || isBusy) return;
    if (isActive) {
      void unfollow(program.id);
      return;
    }
    if (!isFollowing) void follow(program);
    if (!enabled) void setEnabled(true);
  }

  function retrySettings() {
    retry();
    retryFollows();
  }

  const reminderButton = (
    <Button
      aria-pressed={isActive}
      className="w-full shrink-0 !min-h-[52px] !rounded-lg !px-4 !text-base sm:w-auto sm:!min-h-11 sm:!min-w-0 sm:!px-[14px] sm:!text-sm"
      isDisabled={!isEmailAvailable || isBusy}
      tone="secondary"
      onPress={handlePress}
    >
      {isActive ? 'Matikan pengingat email' : 'Dapatkan pengingat email'}
    </Button>
  );

  return (
    <section
      aria-labelledby="rencana-email-reminder-title"
      className="flex flex-col gap-4 rounded-xl border border-[#dbe5ef] bg-[#f5f8fc] p-4 sm:flex-row sm:items-center sm:justify-between sm:p-5"
    >
      <div className="flex min-w-0 items-start gap-3">
        <span className="grid size-11 shrink-0 place-items-center rounded-lg bg-[#edf5ff] text-[#196dcc]">
          <Bell aria-hidden="true" size={20} />
        </span>
        <div className="min-w-0">
          <h2 className="m-0 text-base font-semibold text-[#1b304c]" id="rencana-email-reminder-title">
            Pengingat Email
          </h2>
          <p className="mb-0 mt-1 text-sm leading-6 text-[#617087]" aria-live="polite">
            {status}
          </p>
          {(error || preferenceError) && (
            <div className="mt-2 flex flex-wrap items-center gap-2 text-sm text-[#b72f35]" role="alert">
              <span>{error ?? preferenceError}</span>
              <Button className="!min-h-8 !px-2 !text-sm" tone="quiet" onPress={retrySettings}>
                <RotateCw aria-hidden="true" size={14} /> Coba lagi
              </Button>
            </div>
          )}
        </div>
      </div>
      {isSignedIn ? (
        reminderButton
      ) : (
        <Dialog
          trigger={reminderButton}
          open={isPromptOpen}
          onOpenChange={setIsPromptOpen}
          title="Masuk untuk mengaktifkan pengingat email"
          description="Masuk atau buat akun agar kabar terbaru program ini dapat dikirim ke emailmu."
          closeLabel="Tutup"
        >
          {isConfigured ? (
            <div className="grid gap-3 sm:grid-cols-2">
              <Link className="button primary" href={loginHref}>Masuk</Link>
              <Link className="button secondary" href={signupHref}>Buat akun</Link>
            </div>
          ) : (
            <p className="text-sm leading-6 text-[#617087]">Fitur akun belum terhubung.</p>
          )}
        </Dialog>
      )}
    </section>
  );
}
