'use client';

import { useCallback, useEffect, useSyncExternalStore } from 'react';
import { useAuth } from './use-auth';
import {
  clearSavedPrograms,
  getSavedProgramsSnapshot,
  loadSavedPrograms,
  retrySavedPrograms,
  subscribeSavedPrograms,
  toggleSavedProgram,
} from './saved-program-store';
import type { UseSavedIdsResult } from './types';

export function useSavedIds(): UseSavedIdsResult {
  const { user, isReady, isConfigured } = useAuth();
  const userId = user?.id ?? null;
  const snapshot = useSyncExternalStore(
    (listener) => subscribeSavedPrograms(userId, listener),
    () => getSavedProgramsSnapshot(userId),
    () => getSavedProgramsSnapshot(null),
  );

  useEffect(() => {
    if (userId) void loadSavedPrograms(userId);
  }, [userId]);

  const toggle = useCallback(
    async (programId: string) => {
      if (userId) await toggleSavedProgram(userId, programId);
    },
    [userId],
  );

  const clear = useCallback(async () => {
    if (userId) await clearSavedPrograms(userId);
  }, [userId]);

  const retry = useCallback(async () => {
    if (userId) await retrySavedPrograms(userId);
  }, [userId]);

  return {
    ...snapshot,
    isLoading: snapshot.isLoading || (isConfigured && !isReady),
    toggle,
    clear,
    retry,
  };
}
