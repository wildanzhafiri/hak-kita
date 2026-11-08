'use client';

import { useEffect, useMemo, useSyncExternalStore } from 'react';
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
import { BERKAS_STORAGE_PREFIX, STEP_PROGRESS_STORAGE_PREFIX } from '@/config/storage';
import { useAuth } from '@/hooks/use-auth';
import { useSavedIds } from '@/hooks/use-saved-ids';
import { useStoredValues } from '@/hooks/use-stored-value';
import { useToday } from '@/hooks/use-today';
import {
  clearBerkasProgress,
  getBerkasProgressRevision,
  getBerkasProgressSnapshot,
  loadBerkasProgress,
  subscribeAllBerkasProgress,
} from '@/features/berkas/berkas-progress-store';
import type { RencanaEntry, RencanaState, UseRencanaOptions } from './types';

function storageKey(programId: string): string {
  return `${BERKAS_STORAGE_PREFIX}${programId}`;
}

export function useRencana({ programs, wilayah, builtOn }: UseRencanaOptions): RencanaState {
  const { user, isReady } = useAuth();
  const userId = user?.id ?? null;
  const today = useToday(builtOn);
  const withBerkas = useMemo(() => programs.filter(hasBerkas), [programs]);
  const keys = useMemo(() => withBerkas.map((program) => storageKey(program.id)), [withBerkas]);
  const [values, store] = useStoredValues(keys);
  const guideKeys = useMemo(
    () => programs.map((program) => `${STEP_PROGRESS_STORAGE_PREFIX}${program.id}`),
    [programs],
  );
  const [guideValues, storeGuide] = useStoredValues(guideKeys);
  const savedIds = useSavedIds();
  useSyncExternalStore(subscribeAllBerkasProgress, getBerkasProgressRevision, () => 0);
  const accountProgress = withBerkas.map((program) =>
    userId ? getBerkasProgressSnapshot(userId, program.id) : null,
  );

  useEffect(() => {
    if (!userId || !isReady) return;
    withBerkas.forEach((program) => void loadBerkasProgress(userId, program.id));
  }, [isReady, userId, withBerkas]);

  return useMemo(() => {
    const entries: RencanaEntry[] = [];
    const untouched: ProgramWithBerkas[] = [];

    withBerkas.forEach((program, i) => {
      const account = accountProgress[i];
      const progress = account
        ? { answers: account.answers, checked: account.checked, note: account.note }
        : parseBerkasProgress(values[i] ?? null);
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
    const startedGuides = programs.filter((program, index) => Boolean(guideValues[index]));
    const guided = programs.filter(
      (program) =>
        saved.some((entry) => entry.id === program.id) ||
        startedGuides.some((entry) => entry.id === program.id),
    );
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

    const clearBerkas = (programId: string) => {
      if (userId) {
        if (getBerkasProgressSnapshot(userId, programId).isLoading) return;
        clearBerkasProgress(userId, programId);
      }
      store(storageKey(programId), serializeBerkasProgress(EMPTY_BERKAS_PROGRESS));
    };

    return {
      programs,
      today,
      wilayah,
      builtOn,
      entries,
      untouched,
      saved,
      guided,
      savedIsLoading: savedIds.isLoading,
      savedError: savedIds.error,
      berkasIsLoading: accountProgress.some((snapshot) => snapshot?.isLoading),
      berkasError: accountProgress.find((snapshot) => snapshot?.error)?.error ?? null,
      deadlines: sortDeadlines(
        [...tracked.values()].map((program) => buildDeadline(program, today)),
      ),
      nextStep: pickNextStep({ entries, saved, guides: startedGuides, today }),
      overall,
      clearBerkas,
      toggleSaved: savedIds.toggle,
      clearAll: () => {
        withBerkas.forEach((program) => clearBerkas(program.id));
        guideKeys.forEach((key) => storeGuide(key, ''));
        savedIds.clear();
      },
    };
  }, [
    programs,
    withBerkas,
    wilayah,
    builtOn,
    today,
    values,
    store,
    guideValues,
    guideKeys,
    storeGuide,
    savedIds,
    userId,
    accountProgress,
  ]);
}
