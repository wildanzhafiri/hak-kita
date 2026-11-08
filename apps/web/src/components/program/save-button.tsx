'use client';

import { Bookmark } from 'lucide-react';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { useAuth } from '@/hooks/use-auth';
import { useSavedIds } from '@/hooks/use-saved-ids';
import { Button } from '@/components/ui/button';
import { SavePrompt } from './save-prompt';
import type { SaveButtonProps } from './types';

export function SaveButton({ program, variant = 'icon', className = '' }: SaveButtonProps) {
  const pathname = usePathname();
  const { user, isReady, isConfigured } = useAuth();
  const { ids, toggle, isLoading, isSaving } = useSavedIds();
  const [isPromptOpen, setIsPromptOpen] = useState(false);
  const saved = user !== null && ids.includes(program.id);
  const isDisabled = !isReady || (user !== null && (isLoading || isSaving));

  function handleSave() {
    if (!user) {
      setIsPromptOpen(true);
      return;
    }
    void toggle(program.id);
  }

  const button =
    variant === 'button' ? (
      <Button
        className="w-full"
        tone="secondary"
        aria-pressed={saved}
        isDisabled={isDisabled}
        onPress={handleSave}
      >
        {saved ? 'Tersimpan di Rencanaku' : 'Simpan ke Rencanaku'}{' '}
        <Bookmark fill={saved ? 'currentColor' : 'none'} size={17} />
      </Button>
    ) : (
      <Button
        className={`save-button size-10 ${className}`}
        tone="icon"
        aria-pressed={saved}
        aria-label={saved ? `Hapus ${program.nama} dari Rencanaku` : `Simpan ${program.nama}`}
        isDisabled={isDisabled}
        onPress={handleSave}
      >
        <Bookmark fill={saved ? 'currentColor' : 'none'} size={18} />
      </Button>
    );

  return (
    <>
      {user ? (
        button
      ) : (
        <SavePrompt
          currentPath={pathname}
          isConfigured={isConfigured}
          onOpenChange={setIsPromptOpen}
          open={isPromptOpen}
          programId={program.id}
          trigger={button}
        />
      )}
    </>
  );
}
