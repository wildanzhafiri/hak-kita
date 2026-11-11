'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog } from '@/components/ui/dialog';
import { PROGRAM_DETAIL_COPY } from './content';
import type { ProgramDeleteDialogProps } from './types';

function readErrorMessage(payload: unknown) {
  if (!payload || typeof payload !== 'object' || !('error' in payload)) return null;
  return typeof payload.error === 'string' ? payload.error : null;
}

export function ProgramDeleteDialog({ programId, isOpen, onOpenChange }: ProgramDeleteDialogProps) {
  const router = useRouter();
  const [isDeleting, setIsDeleting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  async function handleDelete() {
    if (isDeleting) return;
    setIsDeleting(true);
    setErrorMessage(null);
    try {
      const response = await fetch(`/api/admin/programs/${encodeURIComponent(programId)}`, {
        method: 'DELETE',
      });
      const responseBody: unknown = await response.json().catch(() => null);
      if (!response.ok) {
        setErrorMessage(readErrorMessage(responseBody) ?? PROGRAM_DETAIL_COPY.deleteFailure);
        setIsDeleting(false);
        return;
      }
      router.replace('/admin/informasi');
      router.refresh();
    } catch {
      setErrorMessage(PROGRAM_DETAIL_COPY.deleteFailure);
      setIsDeleting(false);
    }
  }

  return (
    <Dialog
      closeLabel={PROGRAM_DETAIL_COPY.cancelDelete}
      description={PROGRAM_DETAIL_COPY.deleteDescription}
      onOpenChange={onOpenChange}
      open={isOpen}
      title={PROGRAM_DETAIL_COPY.deleteTitle}
      trigger={null}
    >
      <div className="flex flex-col gap-5">
        <p className="text-sm leading-6 text-[#64748b]">{PROGRAM_DETAIL_COPY.deleteWarning}</p>
        {errorMessage && (
          <p
            className="rounded-lg border border-[#f0c7c9] bg-[#fff5f5] p-3 text-sm text-[#a72b32]"
            role="alert"
          >
            {errorMessage}
          </p>
        )}
        <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
          <Button
            className="sm:min-w-32"
            isDisabled={isDeleting}
            onPress={() => onOpenChange(false)}
            tone="secondary"
          >
            {PROGRAM_DETAIL_COPY.cancelDelete}
          </Button>
          <Button
            className="sm:min-w-32"
            isDisabled={isDeleting}
            onPress={handleDelete}
            tone="danger"
          >
            <Trash2 aria-hidden="true" size={16} />
            {isDeleting ? 'Menghapus' : PROGRAM_DETAIL_COPY.confirmDelete}
          </Button>
        </div>
      </div>
    </Dialog>
  );
}
