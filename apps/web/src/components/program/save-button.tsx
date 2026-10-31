'use client';

import { Bookmark, BookmarkCheck } from 'lucide-react';
import { useSavedIds } from '@/hooks/use-saved-ids';
import type { SaveButtonProps } from './types';

export function SaveButton({ program, variant = 'icon' }: SaveButtonProps) {
  const { ids, toggle } = useSavedIds();
  const saved = ids.includes(program.id);
  const Icon = saved ? BookmarkCheck : Bookmark;

  if (variant === 'button') {
    return (
      <button
        className="button secondary full"
        aria-pressed={saved}
        onClick={() => toggle(program.id)}
      >
        {saved ? 'Tersimpan di Rencanaku' : 'Simpan ke Rencanaku'} <Icon size={17} />
      </button>
    );
  }

  return (
    <button
      className="save-button"
      aria-pressed={saved}
      aria-label={saved ? `Hapus ${program.nama} dari Rencanaku` : `Simpan ${program.nama}`}
      onClick={() => toggle(program.id)}
    >
      <Icon size={18} />
    </button>
  );
}
