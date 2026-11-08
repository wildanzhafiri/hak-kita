'use client';

import { useState } from 'react';
import { Trash } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog } from '@/components/ui/dialog';
import type { ClearAllButtonProps } from './types';

export function ClearAllButton({ onConfirm }: ClearAllButtonProps) {
  const [confirming, setConfirming] = useState(false);

  return (
    <Dialog
      trigger={
        <Button tone="quiet" onPress={() => setConfirming(true)}>
          <Trash size={14} /> Kosongkan Rencanaku
        </Button>
      }
      open={confirming}
      onOpenChange={setConfirming}
      title="Kosongkan Rencanaku?"
      description="Program tersimpan di akun dan progres berkas di browser ini akan dihapus."
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
          Ya, kosongkan
        </Button>
      </div>
    </Dialog>
  );
}
