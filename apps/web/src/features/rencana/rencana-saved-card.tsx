'use client';

import { ArrowRight, Bookmark } from 'lucide-react';
import Link from 'next/link';
import { parseStepProgress, programPath, programSteps } from '@hakkita/domain';
import { Button } from '@/components/ui/button';
import { STEP_PROGRESS_STORAGE_PREFIX } from '@/config/storage';
import { useStoredValue } from '@/hooks/use-stored-value';
import type { RencanaSavedCardProps } from './types';

export function RencanaSavedCard({
  program,
  isSaved,
  onPrepare,
  onToggleSaved,
}: RencanaSavedCardProps) {
  const steps = programSteps(program);
  const [raw] = useStoredValue(`${STEP_PROGRESS_STORAGE_PREFIX}${program.id}`);
  const completed = parseStepProgress(raw, steps.length).completed.length;

  return (
    <article className="flex min-w-0 flex-col rounded-xl border border-[#dbe5ef] bg-white p-5 sm:p-6">
      <div className="flex min-w-0 items-start justify-between gap-3">
        <h3 className="m-0 min-w-0 text-base font-semibold leading-6 text-[#1b304c]">
          <Link className="hover:text-[#196dcc] hover:underline" href={programPath(program)}>
            {program.nama}
          </Link>
        </h3>
        <Button
          aria-label={`${isSaved ? 'Hapus' : 'Simpan'} ${program.nama} ${isSaved ? 'dari' : 'ke'} Rencanaku`}
          className="!size-9 shrink-0 !text-[#196dcc]"
          tone="icon"
          onPress={() => onToggleSaved(program)}
        >
          <Bookmark
            aria-hidden="true"
            fill={isSaved ? 'currentColor' : 'none'}
            size={19}
            strokeWidth={1.8}
          />
        </Button>
      </div>
      <p className="mb-0 mt-2 line-clamp-3 text-sm leading-6 text-[#617087]">{program.ringkasan}</p>
      <div className="mt-5 grid grid-cols-[1fr_auto] items-center gap-x-3 gap-y-2 text-sm text-[#617087]">
        <span className="font-semibold text-[#1b304c]">Persiapan</span>
        {steps.length > 0 ? (
          <span>
            {completed} dari {steps.length} sudah ditandai
          </span>
        ) : (
          <span className="col-span-2">Panduan langkah belum tersedia</span>
        )}
        {steps.length >= 2 && (
          <div
            aria-label={`Progres persiapan ${program.nama}`}
            aria-valuemax={steps.length}
            aria-valuemin={0}
            aria-valuenow={completed}
            className="col-span-2 h-1.5 overflow-hidden rounded-full bg-[#e9eff6]"
            role="progressbar"
          >
            <span
              className="block h-full rounded-full bg-[#196dcc] transition-[width] motion-reduce:transition-none"
              style={{ width: `${Math.round((completed / steps.length) * 100)}%` }}
            />
          </div>
        )}
      </div>
      <div className="mt-4 border-t border-[#e7ecf2] pt-2">
        <Button
          className="!min-h-10 !px-0 !text-sm !font-semibold !text-[#196dcc]"
          tone="quiet"
          onPress={() => onPrepare(program)}
        >
          Atur persiapan <ArrowRight aria-hidden="true" size={18} />
        </Button>
      </div>
    </article>
  );
}
