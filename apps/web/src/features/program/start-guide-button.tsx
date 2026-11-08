'use client';

import Link from 'next/link';
import { ListChecks } from 'lucide-react';
import { EMPTY_STEP_PROGRESS, serializeStepProgress } from '@hakkita/domain';
import { STEP_PROGRESS_STORAGE_PREFIX } from '@/config/storage';
import { useStoredValue } from '@/hooks/use-stored-value';
import type { StartGuideButtonProps } from './types';

export function StartGuideButton({ program }: StartGuideButtonProps) {
  const [raw, store] = useStoredValue(`${STEP_PROGRESS_STORAGE_PREFIX}${program.id}`);

  return (
    <Link
      className="mt-3 flex min-h-11 w-full items-center justify-center gap-2 rounded-lg border border-[#c7dbf2] bg-white px-4 text-center text-sm font-semibold text-[#196dcc] transition-colors hover:bg-[#f0f6fd] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#196dcc] motion-reduce:transition-none"
      href="/rencanaku#panduan-langkah"
      onClick={() => {
        if (!raw) store(serializeStepProgress(EMPTY_STEP_PROGRESS));
      }}
    >
      <ListChecks size={17} />{' '}
      {raw ? 'Lanjutkan panduan di Rencanaku' : 'Mulai panduan di Rencanaku'}
    </Link>
  );
}
