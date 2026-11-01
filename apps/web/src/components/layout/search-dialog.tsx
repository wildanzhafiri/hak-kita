'use client';

import { ArrowUpRight } from 'lucide-react';
import { Dialog } from '../ui/dialog';
import { SearchBar } from '../ui/search-bar';
import type { SearchDialogProps } from './types';

export function SearchDialog({ open, onClose }: SearchDialogProps) {
  return (
    <Dialog
      open={open}
      onOpenChange={(isOpen) => {
        if (!isOpen) onClose();
      }}
      title="Apa yang kamu cari?"
      description="Temukan program dan layanan dalam satu tempat."
      closeLabel="Tutup pencarian"
    >
      <SearchBar
        autoFocus
        inputLabel="Kata pencarian"
        placeholder="Coba: pendidikan atau KTP"
        submitIcon={<ArrowUpRight size={20} />}
        onSubmitted={onClose}
      />
    </Dialog>
  );
}
