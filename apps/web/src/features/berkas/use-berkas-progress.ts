'use client';

import { useEffect, useMemo, useSyncExternalStore } from 'react';
import type { Berkas } from '@hakkita/schema';
import {
  EMPTY_BERKAS_PROGRESS,
  parseBerkasProgress,
  prunedChecked,
  selectDokumen,
  serializeBerkasProgress,
  type BerkasProgress,
} from '@hakkita/domain';
import { BERKAS_STORAGE_PREFIX } from '@/config/storage';
import { useAuth } from '@/hooks/use-auth';
import { useStoredValue } from '@/hooks/use-stored-value';
import {
  clearBerkasProgress,
  getBerkasProgressSnapshot,
  loadBerkasProgress,
  saveBerkasProgress,
  subscribeBerkasProgress,
} from './berkas-progress-store';
import type { UseBerkasProgressResult } from './types';

export function useBerkasProgress(programId: string, berkas: Berkas): UseBerkasProgressResult {
  const { user, isReady, isConfigured } = useAuth();
  const userId = user?.id ?? null;
  const [raw, store] = useStoredValue(`${BERKAS_STORAGE_PREFIX}${programId}`);
  const localProgress = useMemo(() => parseBerkasProgress(raw), [raw]);
  const snapshot = useSyncExternalStore(
    (listener) => subscribeBerkasProgress(userId, programId, listener),
    () => getBerkasProgressSnapshot(userId, programId),
    () => getBerkasProgressSnapshot(null, programId),
  );

  useEffect(() => {
    if (userId && isReady) void loadBerkasProgress(userId, programId);
  }, [isReady, programId, userId]);

  const progress = useMemo<BerkasProgress>(() => {
    const shouldHideLocalProgress = isConfigured && !isReady;
    if (userId) {
      return { answers: snapshot.answers, checked: snapshot.checked, note: snapshot.note };
    }
    return shouldHideLocalProgress ? EMPTY_BERKAS_PROGRESS : localProgress;
  }, [isConfigured, isReady, localProgress, snapshot, userId]);

  function save(next: BerkasProgress): void {
    if (userId) {
      saveBerkasProgress(userId, programId, next);
      return;
    }
    store(serializeBerkasProgress(next));
  }

  function reset(): void {
    if (userId) {
      if (snapshot.isLoading) return;
      store(serializeBerkasProgress(EMPTY_BERKAS_PROGRESS));
      clearBerkasProgress(userId, programId);
      return;
    }
    store(serializeBerkasProgress(EMPTY_BERKAS_PROGRESS));
  }

  return {
    progress,
    isLoading: snapshot.isLoading || (isConfigured && !isReady),
    isSaving: snapshot.isSaving,
    error: snapshot.error,
    answer: (questionId, value) => {
      const answers = { ...progress.answers, [questionId]: value };
      const checked = prunedChecked(progress.checked, selectDokumen(berkas, answers));
      save({ ...progress, answers, checked });
    },
    toggle: (dokumenId) => {
      if (userId && snapshot.isLoading) return;
      const checked = progress.checked.includes(dokumenId)
        ? progress.checked.filter((id) => id !== dokumenId)
        : [...progress.checked, dokumenId];
      save({ ...progress, checked });
    },
    setNote: (note) => save({ ...progress, note }),
    reset,
  };
}
