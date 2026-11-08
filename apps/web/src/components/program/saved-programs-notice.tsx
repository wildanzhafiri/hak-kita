'use client';

import { Button } from '@/components/ui/button';
import { useSavedIds } from '@/hooks/use-saved-ids';

export function SavedProgramsNotice() {
  const { error, retry } = useSavedIds();
  if (!error) return null;

  return (
    <div
      className="fixed inset-x-4 bottom-4 z-50 mx-auto flex max-w-lg items-start gap-3 rounded-xl border border-[#e5c9c9] bg-white p-4 text-sm text-[#9e3035] shadow-[0_12px_36px_rgba(20,35,55,0.16)] sm:inset-x-auto sm:right-6 sm:bottom-6"
      role="alert"
    >
      <p className="min-w-0 flex-1">{error}</p>
      <Button className="shrink-0" onPress={() => void retry()} tone="quiet">
        Coba lagi
      </Button>
    </div>
  );
}
