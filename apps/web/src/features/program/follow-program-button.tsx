'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Bell, BellOff } from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog } from '@/components/ui/dialog';
import { useProgramFollows } from '@/hooks/use-program-follows';
import { FOLLOW_PROGRAM_CONTENT } from './content';
import type { FollowProgramButtonProps } from './types';

export function FollowProgramButton({
  program,
  showDescription = true,
  actionLabel,
  actionTone = 'secondary',
}: FollowProgramButtonProps) {
  const pathname = usePathname();
  const [isPromptOpen, setIsPromptOpen] = useState(false);
  const {
    rows,
    isLoading,
    busyProgramId,
    error,
    isSignedIn,
    isConfigured,
    follow,
    unfollow,
    retry,
  } = useProgramFollows();
  const isFollowing = rows.some((row) => row.program_id === program.id);
  const loginHref = `/masuk?${new URLSearchParams({ next: pathname }).toString()}`;
  const signupHref = `/daftar?${new URLSearchParams({ next: pathname }).toString()}`;

  function handlePress() {
    if (!isSignedIn) {
      setIsPromptOpen(true);
      return;
    }
    if (isFollowing) void unfollow(program.id);
    else void follow(program);
  }

  const trigger = (
    <Button
      tone={actionTone}
      className="w-full"
      aria-pressed={isFollowing}
      isDisabled={isLoading || busyProgramId !== null || (!!error && isSignedIn)}
      onPress={handlePress}
    >
      {isFollowing ? <BellOff size={17} /> : <Bell size={17} />}
      {isFollowing
        ? FOLLOW_PROGRAM_CONTENT.unfollow
        : (actionLabel ?? FOLLOW_PROGRAM_CONTENT.follow)}
    </Button>
  );

  return (
    <div className="mt-3 grid gap-2">
      {isSignedIn ? (
        trigger
      ) : (
        <Dialog
          trigger={trigger}
          open={isPromptOpen}
          onOpenChange={setIsPromptOpen}
          title={FOLLOW_PROGRAM_CONTENT.promptTitle}
          description={FOLLOW_PROGRAM_CONTENT.promptDescription}
          closeLabel="Tutup"
        >
          {isConfigured ? (
            <div className="flex flex-wrap gap-3">
              <Link className="button" href={loginHref}>
                Masuk
              </Link>
              <Link className="button secondary" href={signupHref}>
                Buat akun
              </Link>
            </div>
          ) : (
            <p className="text-sm text-[#617087]">{FOLLOW_PROGRAM_CONTENT.offline}</p>
          )}
        </Dialog>
      )}
      {showDescription && (
        <p className="m-0 text-xs leading-5 text-[#617087]">{FOLLOW_PROGRAM_CONTENT.description}</p>
      )}
      {error && isSignedIn && (
        <div className="flex flex-wrap items-center gap-2 text-xs text-[#b72f35]" role="alert">
          <span>{error}</span>
          <Button tone="quiet" className="min-h-8 px-1 text-xs" onPress={retry}>
            Coba lagi
          </Button>
        </div>
      )}
    </div>
  );
}
