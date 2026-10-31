'use client';

import { useState } from 'react';
import { Trash2 } from 'lucide-react';
import type { ClearAllButtonProps } from './types';

export function ClearAllButton({ onConfirm }: ClearAllButtonProps) {
  const [confirming, setConfirming] = useState(false);

  if (!confirming) {
    return (
      <button className="text-button" onClick={() => setConfirming(true)}>
        <Trash2 size={14} /> Hapus semua data di perangkat ini
      </button>
    );
  }

  return (
    <span className="confirm-clear" role="group" aria-label="Konfirmasi hapus semua data">
      <button
        className="text-button danger"
        onClick={() => {
          onConfirm();
          setConfirming(false);
        }}
      >
        Ya, hapus semuanya
      </button>
      <button className="text-button" onClick={() => setConfirming(false)}>
        Batal
      </button>
    </span>
  );
}
