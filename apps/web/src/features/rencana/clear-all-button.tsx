'use client';

import { useState } from 'react';
import { Trash } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog } from '@/components/ui/dialog';
import type { ClearAllButtonProps } from './types';

export function ClearAllButton({ onConfirm }: ClearAllButtonProps) {
  const [confirming, setConfirming] = useState(false);

  return (
    <>
      <Button tone="quiet" onPress={() => setConfirming(true)}>
        <Trash size={14} /> Hapus semua data di perangkat ini
      </Button>
      <Dialog
        open={confirming}
        onOpenChange={setConfirming}
        title="Hapus semua data?"
        description="Semua isian dan catatan yang tersimpan di perangkat ini akan dihapus."
        closeLabel="Tutup konfirmasi"
      >
        <div className="flex justify-end gap-3">
          <Button tone="secondary" onPress={() => setConfirming(false)}>
            Batal
          </Button>
          <Button
            tone="danger"
            onPress={() => {
              onConfirm();
              setConfirming(false);
            }}
          >
            Ya, hapus semuanya
          </Button>
        </div>
      </Dialog>
    </>
  );
}
