'use client';

import { Bookmark } from 'lucide-react';
import { useSavedIds } from '@/hooks/use-saved-ids';
import { Button } from '@/components/ui/button';
import type { SaveButtonProps } from './types';

export function SaveButton({ program, variant = 'icon' }: SaveButtonProps) {
  const { ids, toggle } = useSavedIds();
  const saved = ids.includes(program.id);
  if (variant === 'button') {
    return (
      <Button
        className="w-full"
        tone="secondary"
        aria-pressed={saved}
        onPress={() => toggle(program.id)}
      >
        {saved ? 'Tersimpan di Rencanaku' : 'Simpan ke Rencanaku'}{' '}
        <Bookmark fill={saved ? 'currentColor' : 'none'} size={17} />
      </Button>
    );
  }

  return (
    <Button
      className="save-button size-10"
      tone="icon"
      aria-pressed={saved}
      aria-label={saved ? `Hapus ${program.nama} dari Rencanaku` : `Simpan ${program.nama}`}
      onPress={() => toggle(program.id)}
    >
      <Bookmark fill={saved ? 'currentColor' : 'none'} size={18} />
    </Button>
  );
}
