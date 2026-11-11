'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Pencil, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { PROGRAM_DETAIL_COPY } from './content';
import { ProgramDeleteDialog } from './program-delete-dialog';
import { ProgramDetailContent } from './program-detail-content';
import { ProgramEditor } from './program-editor';
import type { ProgramDetailProps } from './types';

export function ProgramDetail({ program, canManage }: ProgramDetailProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  if (isEditing) {
    return (
      <section className="mx-auto max-w-[1080px] rounded-xl border border-[#e1e9f2] bg-white p-5 sm:p-7">
        <div className="mb-6">
          <h1 className="text-2xl font-semibold text-[#253044]">
            {PROGRAM_DETAIL_COPY.editHeading}
          </h1>
          <p className="mt-2 text-sm text-[#64748b]">{program.nama}</p>
        </div>
        <ProgramEditor onCancel={() => setIsEditing(false)} program={program} />
      </section>
    );
  }

  return (
    <div className="mx-auto max-w-[1080px] space-y-6">
      <Link
        className="inline-flex min-h-10 items-center gap-2 text-sm font-semibold text-[#1769c2] underline-offset-4 hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1769c2]"
        href="/admin/informasi"
      >
        <ArrowLeft aria-hidden="true" size={17} />
        {PROGRAM_DETAIL_COPY.back}
      </Link>

      {canManage && (
        <div className="flex flex-wrap gap-3">
          <Button onPress={() => setIsEditing(true)} tone="secondary">
            <Pencil aria-hidden="true" size={16} />
            {PROGRAM_DETAIL_COPY.editAction}
          </Button>
          <Button onPress={() => setIsDeleteDialogOpen(true)} tone="danger-outline">
            <Trash2 aria-hidden="true" size={16} />
            {PROGRAM_DETAIL_COPY.deleteAction}
          </Button>
        </div>
      )}

      <ProgramDetailContent program={program} />
      {canManage && (
        <ProgramDeleteDialog
          isOpen={isDeleteDialogOpen}
          onOpenChange={setIsDeleteDialogOpen}
          programId={program.id}
        />
      )}
    </div>
  );
}
