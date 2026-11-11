'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { EMPTY_PREFERENCES } from '@hakkita/domain';
import type { PreferensiProfil } from '@hakkita/schema';
import { useAuth } from '@/hooks/use-auth';
import { clearUserPreferences, loadUserProfile, saveUserProfile } from './profile-store';
import type { ProfileContextValue, ProfileProviderProps, ProfileState } from './types';
import { ProfileContext } from './use-profile';

const IDLE_STATE: ProfileState = { status: 'idle', nama: '', preferensi: EMPTY_PREFERENCES };

export function ProfileProvider({ children }: ProfileProviderProps) {
  const { user } = useAuth();
  const userId = user?.id ?? null;
  const [loaded, setLoaded] = useState<{ userId: string; state: ProfileState } | null>(null);

  useEffect(() => {
    if (!userId) return;
    let isActive = true;
    void loadUserProfile(userId).then((result) => {
      if (!isActive) return;
      setLoaded({
        userId,
        state: {
          status: result.error ? 'error' : 'ready',
          nama: result.nama,
          preferensi: result.preferensi,
        },
      });
    });
    return () => {
      isActive = false;
    };
  }, [userId]);

  const signupName =
    typeof user?.user_metadata?.nama === 'string' ? user.user_metadata.nama.trim() : '';
  const state = useMemo<ProfileState>(() => {
    if (!userId) return IDLE_STATE;
    if (loaded?.userId !== userId) return { ...IDLE_STATE, status: 'loading' };
    return loaded.state.nama ? loaded.state : { ...loaded.state, nama: signupName };
  }, [userId, loaded, signupName]);

  const save = useCallback(
    async (nama: string, preferensi: PreferensiProfil) => {
      if (!userId) return null;
      const error = await saveUserProfile(userId, nama, preferensi);
      if (!error) setLoaded({ userId, state: { status: 'ready', nama, preferensi } });
      return error;
    },
    [userId],
  );

  const clearPreferences = useCallback(async () => {
    if (!userId) return null;
    const nama = loaded?.userId === userId ? loaded.state.nama : '';
    const error = await clearUserPreferences(userId, nama);
    if (!error) {
      setLoaded({ userId, state: { status: 'ready', nama, preferensi: EMPTY_PREFERENCES } });
    }
    return error;
  }, [userId, loaded]);

  const value = useMemo<ProfileContextValue>(
    () => ({ ...state, save, clearPreferences }),
    [state, save, clearPreferences],
  );

  return <ProfileContext.Provider value={value}>{children}</ProfileContext.Provider>;
}
