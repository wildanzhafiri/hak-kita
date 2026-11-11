'use client';

import { Check, CircleHelp, Trash2 } from 'lucide-react';
import {
  parseStepProgress,
  programSteps,
  serializeStepProgress,
  toggleStepCompleted,
  toggleStepStuck,
} from '@hakkita/domain';
import { Button } from '@/components/ui/button';
import { ProgressMeter } from '@/components/ui/progress-meter';
import { STEP_PROGRESS_STORAGE_PREFIX } from '@/config/storage';
import { useStoredValue } from '@/hooks/use-stored-value';
import { RencanaStepHelp } from './rencana-step-help';
import type { RencanaStepGuideProps } from './types';

export function RencanaStepGuide({ program }: RencanaStepGuideProps) {
  const steps = programSteps(program);
  const [raw, store] = useStoredValue(`${STEP_PROGRESS_STORAGE_PREFIX}${program.id}`);
  const progress = parseStepProgress(raw, steps.length);

  return (
    <article
      className="rounded-2xl border border-[#dbe5ef] bg-white p-5 sm:p-6"
      aria-label={`Panduan ${program.nama}`}
    >
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="min-w-0">
          <h3 className="m-0 text-lg font-bold leading-snug text-[#1b304c]">{program.nama}</h3>
          <p className="mb-0 mt-2 text-sm leading-6 text-[#617087]">{program.ringkasan}</p>
        </div>
        {raw && (
          <Button tone="quiet" className="text-xs" onPress={() => store('')}>
            <Trash2 size={14} /> Hapus progres langkah
          </Button>
        )}
      </div>
      <div className="mt-5">
        <ProgressMeter
          value={progress.completed.length}
          max={steps.length}
          summary={`${progress.completed.length} dari ${steps.length} langkah kamu tandai selesai`}
          label={`Progres langkah ${program.nama}`}
        />
      </div>
      <ol className="mt-6 grid grid-cols-1 gap-3 sm:gap-4">
        {steps.map((step, index) => {
          const isDone = progress.completed.includes(index);
          const isStuck = progress.stuck === index;
          return (
            <li
              key={`${index}-${step}`}
              className="rounded-xl border border-[#e1e7ee] bg-[#f8fbff] p-3 sm:p-4"
            >
              <div className="flex items-start gap-3">
                <span className="grid size-8 shrink-0 place-items-center rounded-full bg-[#e9f2fd] text-sm font-bold text-[#196dcc]">
                  {index + 1}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="m-0 text-sm leading-6 text-[#25354b]">{step}</p>
                  <div className="mt-3 flex flex-col gap-2 sm:flex-row sm:flex-wrap">
                    <Button
                      tone={isDone ? 'primary' : 'secondary'}
                      className="min-h-10 w-full px-3 text-sm !justify-start sm:w-auto sm:!justify-center"
                      aria-pressed={isDone}
                      aria-label={`${isDone ? 'Batalkan selesai' : 'Tandai selesai'} langkah ${index + 1} ${program.nama}`}
                      onPress={() =>
                        store(serializeStepProgress(toggleStepCompleted(progress, index)))
                      }
                    >
                      <Check size={15} /> {isDone ? 'Sudah dilakukan' : 'Tandai selesai'}
                    </Button>
                    <Button
                      tone={isStuck ? 'primary' : 'quiet'}
                      className="min-h-10 w-full px-3 text-sm !justify-start sm:w-auto sm:!justify-center"
                      aria-pressed={isStuck}
                      aria-label={`${isStuck ? 'Batalkan kendala' : 'Saya terkendala pada'} langkah ${index + 1} ${program.nama}`}
                      onPress={() => store(serializeStepProgress(toggleStepStuck(progress, index)))}
                    >
                      <CircleHelp size={15} /> Saya terkendala
                    </Button>
                  </div>
                </div>
              </div>
              {isStuck && (
                <div className="mt-3 border-t border-[#dbe5ef] pt-3 sm:mt-4 sm:pt-4 sm:pl-11">
                  <RencanaStepHelp key={index} program={program} />
                </div>
              )}
            </li>
          );
        })}
      </ol>
    </article>
  );
}
