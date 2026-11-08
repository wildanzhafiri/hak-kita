'use client';

import Link from 'next/link';
import { Dialog } from '@/components/ui/dialog';
import type { SavePromptProps } from './types';

export function SavePrompt({
  trigger,
  open,
  onOpenChange,
  programId,
  currentPath,
  isConfigured,
}: SavePromptProps) {
  const params = new URLSearchParams({ next: currentPath, save: programId });
  const loginHref = `/masuk?${params.toString()}`;
  const signupHref = `/daftar?${params.toString()}`;

  return (
    <Dialog
      trigger={trigger}
      closeLabel="Tutup"
      description="Masuk atau buat akun untuk menyimpan program ini ke Rencanaku."
      onOpenChange={onOpenChange}
      open={open}
      title="Simpan program ke akunmu"
    >
      {isConfigured ? (
        <div className="grid gap-3 sm:grid-cols-2">
          <Link
            className="inline-flex min-h-11 items-center justify-center rounded-lg bg-[#196dcc] px-5 font-semibold text-white transition-colors hover:bg-[#1458a3] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#196dcc] motion-reduce:transition-none"
            href={loginHref}
          >
            Masuk
          </Link>
          <Link
            className="inline-flex min-h-11 items-center justify-center rounded-lg border border-[#c7dbf2] bg-white px-5 font-semibold text-[#196dcc] transition-colors hover:bg-[#f0f6fd] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#196dcc] motion-reduce:transition-none"
            href={signupHref}
          >
            Buat akun
          </Link>
        </div>
      ) : (
        <p
          className="rounded-lg border border-[#dce1e6] bg-[#f5f8fc] p-4 text-sm leading-6 text-[#526173]"
          role="status"
        >
          Fitur akun belum terhubung. Admin HAKKITA perlu menambahkan URL dan publishable key
          Supabase.
        </p>
      )}
    </Dialog>
  );
}
