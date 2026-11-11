'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, ArrowUpRight, Pencil, Trash2 } from 'lucide-react';
import { formatDate, isLayanan, programPath } from '@hakkita/domain';
import { Button } from '@/components/ui/button';
import { PROGRAM_DETAIL_COPY } from './content';
import { ProgramDeleteDialog } from './program-delete-dialog';
import { ProgramEditor } from './program-editor';
import { ProgramFollowerNotice } from './program-follower-notice';
import type { ProgramDetailProps } from './types';

export function ProgramDetail({ program, canManage, children }: ProgramDetailProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [savedCount, setSavedCount] = useState(0);

  if (isEditing) {
    return (
      <section className="mx-auto max-w-[1440px] rounded-xl border border-[#e1e9f2] bg-white p-5 sm:p-7">
        <div className="mb-6">
          <h1 className="text-2xl font-semibold text-[#253044]">
            {PROGRAM_DETAIL_COPY.editHeading}
          </h1>
          <p className="mt-2 text-sm text-[#64748b]">{program.nama}</p>
        </div>
        <ProgramEditor
          onCancel={() => setIsEditing(false)}
          onSaved={() => setSavedCount((count) => count + 1)}
          program={program}
        />
      </section>
    );
  }

  const kind = isLayanan(program) ? PROGRAM_DETAIL_COPY.service : PROGRAM_DETAIL_COPY.program;
  const checkedAt = program.tanggalDiperiksa
    ? formatDate(program.tanggalDiperiksa)
    : PROGRAM_DETAIL_COPY.noDate;

  return (
    <div className="mx-auto max-w-[1440px]">
      <Link
        className="mb-[18px] inline-flex items-center gap-[7px] text-[13px] text-[#1769c2] hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1769c2]"
        href="/admin/informasi"
      >
        <ArrowLeft aria-hidden="true" size={17} />
        {PROGRAM_DETAIL_COPY.back}
      </Link>
      <h1 className="m-0 text-[28px] font-semibold leading-[1.3] text-[#253044] [overflow-wrap:anywhere]">
        {program.nama}
      </h1>
      <p className="mt-2 max-w-[800px] text-sm text-[#64748b]">
        {PROGRAM_DETAIL_COPY.lastChecked(kind, checkedAt)}
      </p>

      <div className="mb-6 mt-5 flex flex-wrap items-center gap-2.5">
        <Link
          className="inline-flex min-h-11 items-center gap-2 rounded-lg border border-[#d6e5f5] bg-white px-4 text-sm font-semibold text-[#1769c2] hover:bg-[#edf5ff] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1769c2]"
          href={programPath(program)}
          rel="noopener noreferrer"
          target="_blank"
        >
          {PROGRAM_DETAIL_COPY.viewInPortal}
          <ArrowUpRight aria-hidden="true" size={17} />
        </Link>
        {canManage && (
          <>
            <Button onPress={() => setIsEditing(true)}>
              <Pencil aria-hidden="true" size={16} />
              {PROGRAM_DETAIL_COPY.editAction}
            </Button>
            <Button onPress={() => setIsDeleteDialogOpen(true)} tone="danger-outline">
              <Trash2 aria-hidden="true" size={16} />
              {PROGRAM_DETAIL_COPY.deleteAction}
            </Button>
          </>
        )}
      </div>

      {children}

      {canManage && program.verifikasi !== 'belum' && (
        <div className="my-6">
          <ProgramFollowerNotice
            hasSavedChange={savedCount > 0}
            programId={program.id}
            refreshKey={savedCount}
          />
        </div>
      )}
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
