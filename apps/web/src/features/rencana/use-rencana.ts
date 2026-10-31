'use client';

import { useMemo } from 'react';
import {
  EMPTY_BERKAS_PROGRESS,
  berkasReadiness,
  buildDeadline,
  hasBerkas,
  hasBerkasProgress,
  parseBerkasProgress,
  pickNextStep,
  selectDokumen,
  serializeBerkasProgress,
  sortDeadlines,
  unansweredQuestions,
  type ProgramWithBerkas,
} from '@hakkita/domain';
import type { Program } from '@hakkita/schema';
import { BERKAS_STORAGE_PREFIX } from '@/config/storage';
import { useSavedIds } from '@/hooks/use-saved-ids';
import { useStoredValues } from '@/hooks/use-stored-value';
import { useToday } from '@/hooks/use-today';
import type { RencanaEntry, RencanaState, UseRencanaOptions } from './types';

function storageKey(programId: string): string {
  return `${BERKAS_STORAGE_PREFIX}${programId}`;
}

export function useRencana({ programs, wilayah, builtOn }: UseRencanaOptions): RencanaState {
  const today = useToday(builtOn);
  const withBerkas = useMemo(() => programs.filter(hasBerkas), [programs]);
  const keys = useMemo(() => withBerkas.map((program) => storageKey(program.id)), [withBerkas]);
  const [values, store] = useStoredValues(keys);
  const savedIds = useSavedIds();

  return useMemo(() => {
    const entries: RencanaEntry[] = [];
    const untouched: ProgramWithBerkas[] = [];

    withBerkas.forEach((program, i) => {
      const progress = parseBerkasProgress(values[i] ?? null);
      if (!hasBerkasProgress(progress)) {
        untouched.push(program);
        return;
      }
      const dokumen = selectDokumen(program.berkas, progress.answers);
      entries.push({
        program,
        note: progress.note.trim(),
        readiness: berkasReadiness(dokumen, progress.checked),
        hasUnanswered: unansweredQuestions(program.berkas, progress.answers).length > 0,
      });
    });

    const saved = savedIds.ids
      .map((id) => programs.find((program) => program.id === id))
      .filter((program): program is Program => program !== undefined);
    const tracked = new Map<string, Program>();
    [...saved, ...entries.map((entry) => entry.program)].forEach((program) =>
      tracked.set(program.id, program),
    );

    const overall = entries.reduce(
      (sum, { readiness }) => ({
        ready: sum.ready + readiness.ready,
        total: sum.total + readiness.total,
      }),
      { ready: 0, total: 0 },
    );

    const clearBerkas = (programId: string) =>
      store(storageKey(programId), serializeBerkasProgress(EMPTY_BERKAS_PROGRESS));

    return {
      today,
      wilayah,
      builtOn,
      entries,
      untouched,
      saved,
      deadlines: sortDeadlines(
        [...tracked.values()].map((program) => buildDeadline(program, today)),
      ),
      nextStep: pickNextStep({ entries, saved, today }),
      overall,
      clearBerkas,
      toggleSaved: savedIds.toggle,
      clearAll: () => {
        withBerkas.forEach((program) => clearBerkas(program.id));
        savedIds.clear();
      },
    };
  }, [programs, withBerkas, wilayah, builtOn, today, values, store, savedIds]);
}
