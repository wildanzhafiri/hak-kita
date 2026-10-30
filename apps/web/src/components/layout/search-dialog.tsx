'use client';

import { useEffect, useRef } from 'react';
import { ArrowUpRight, X } from 'lucide-react';
import { SearchBar } from '../ui/search-bar';
import type { SearchDialogProps } from './types';

export function SearchDialog({ open, onClose, returnFocusRef }: SearchDialogProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    if (open) dialogRef.current?.showModal();
    else dialogRef.current?.close();
  }, [open]);

  return (
    <dialog
      ref={dialogRef}
      className="search-dialog"
      onCancel={onClose}
      onClose={() => {
        onClose();
        returnFocusRef.current?.focus();
      }}
      onClick={(e) => {
        if (e.target === dialogRef.current) onClose();
      }}
    >
      <div className="dialog-title">
        <h2>Apa yang kamu cari?</h2>
        <button className="icon-button" aria-label="Tutup pencarian" onClick={onClose}>
          <X />
        </button>
      </div>
      <p>Temukan program dan layanan dalam satu tempat.</p>
      <SearchBar
        autoFocus
        inputLabel="Kata pencarian"
        placeholder="Coba: pendidikan atau KTP"
        submitIcon={<ArrowUpRight size={20} />}
        onSubmitted={onClose}
      />
    </dialog>
  );
}
