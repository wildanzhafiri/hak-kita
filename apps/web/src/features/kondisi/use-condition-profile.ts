'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { ProfileSchema, type Profile } from '@hakkita/schema';
import { CONDITION_STORAGE_KEY } from '@/config/storage';
import { useAuth } from '@/hooks/use-auth';
import { useStoredValue } from '@/hooks/use-stored-value';
import { EMPTY_PROFILE } from './constants';
import { CONDITION_ACCOUNT_COPY } from './content';
import { deleteAccountConditionProfile, loadAccountConditionProfile, saveAccountConditionProfile } from './condition-profile-store';
import type { UseConditionProfileResult } from './types';

function parseProfile(raw: string | null): Profile {
  if (!raw) return EMPTY_PROFILE;
  try {
    const parsed = ProfileSchema.safeParse(JSON.parse(raw));
    return parsed.success ? parsed.data : EMPTY_PROFILE;
  } catch {
    return EMPTY_PROFILE;
  }
}

export function useConditionProfile(): UseConditionProfileResult {
  const { user, isReady, isConfigured } = useAuth();
  const userId = user?.id ?? null;
  const [raw, store] = useStoredValue(CONDITION_STORAGE_KEY);
  const localProfile = useMemo(() => parseProfile(raw), [raw]);
  const [accountProfile, setAccountProfile] = useState<Profile | null>(null);
  const [loadedUserId, setLoadedUserId] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const saveQueue = useRef(Promise.resolve());
  const pendingSaves = useRef(0);

  useEffect(() => {
    if (!isConfigured) return;
    if (!isReady) return;
    if (!userId) return;

    let isCurrent = true;
    void loadAccountConditionProfile(userId).then((result) => {
      if (!isCurrent) return;
      setAccountProfile(result.profile);
      setLoadedUserId(userId);
      setError(result.error);
      if (result.profile) store(JSON.stringify(result.profile));
    });
    return () => {
      isCurrent = false;
    };
  }, [isConfigured, isReady, store, userId]);

  const isAccountLoading =
    isConfigured && (!isReady || (userId !== null && loadedUserId !== userId));
  const isSavedToAccount =
    userId !== null && loadedUserId === userId && accountProfile !== null;
  const profile = useMemo(
    () => (isSavedToAccount ? accountProfile ?? localProfile : localProfile),
    [accountProfile, isSavedToAccount, localProfile],
  );

  const queueAccountSave = useCallback(
    (next: Profile, onError?: () => void) => {
      if (!userId) return;
      pendingSaves.current += 1;
      setIsSaving(true);
      setError(null);
      saveQueue.current = saveQueue.current
        .then(async () => {
          const saveError = await saveAccountConditionProfile(userId, next);
          if (saveError) {
            setError(saveError);
            onError?.();
          }
        })
        .catch(() => {
          setError(CONDITION_ACCOUNT_COPY.saveError);
          onError?.();
        })
        .finally(() => {
          pendingSaves.current -= 1;
          if (pendingSaves.current === 0) setIsSaving(false);
        });
    },
    [userId],
  );

  const update = useCallback(
    (changes: Partial<Profile>) => {
      const result = ProfileSchema.safeParse({ ...profile, ...changes });
      if (!result.success) return;
      store(JSON.stringify(result.data));
      if (!isSavedToAccount || !userId) return;
      setAccountProfile(result.data);
      queueAccountSave(result.data);
    },
    [isSavedToAccount, profile, queueAccountSave, store, userId],
  );

  const setAccountSaveEnabled = useCallback(
    (enabled: boolean) => {
      if (!userId || isAccountLoading) return;
      if (enabled) {
        setLoadedUserId(userId);
        setAccountProfile(profile);
        queueAccountSave(profile, () => setAccountProfile(null));
        return;
      }
      if (!isSavedToAccount) return;
      setAccountProfile(null);
      pendingSaves.current += 1;
      setIsSaving(true);
      setError(null);
      saveQueue.current = saveQueue.current
        .then(async () => {
          const deleteError = await deleteAccountConditionProfile(userId);
          if (deleteError) {
            setAccountProfile(profile);
            setError(deleteError);
          }
        })
        .catch(() => {
          setAccountProfile(profile);
          setError(CONDITION_ACCOUNT_COPY.deleteError);
        })
        .finally(() => {
          pendingSaves.current -= 1;
          if (pendingSaves.current === 0) setIsSaving(false);
        });
    },
    [isAccountLoading, isSavedToAccount, profile, queueAccountSave, userId],
  );

  const reset = useCallback(() => {
    store(JSON.stringify(EMPTY_PROFILE));
    if (isSavedToAccount) setAccountSaveEnabled(false);
  }, [isSavedToAccount, setAccountSaveEnabled, store]);

  return {
    profile,
    isAccountAuthenticated: userId !== null,
    isAccountConfigured: isConfigured,
    isAccountLoading,
    isSaving,
    isSavedToAccount,
    error: userId ? error : null,
    update,
    setAccountSaveEnabled,
    reset,
  };
}
