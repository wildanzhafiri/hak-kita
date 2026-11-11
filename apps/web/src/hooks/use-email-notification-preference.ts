'use client';

import { useEffect, useState } from 'react';
import { PROGRAM_EMAIL_PREFERENCES_TABLE } from '@/config/auth';
import { getSupabaseBrowserClient } from '@/lib/supabase/client';
import type {
  EmailNotificationPreferenceState,
  UseEmailNotificationPreferenceResult,
} from './types';
import { useAuth } from './use-auth';

const EMPTY_STATE: EmailNotificationPreferenceState = {
  userId: null,
  enabled: false,
  isLoading: false,
  isSaving: false,
  error: null,
};

export function useEmailNotificationPreference(): UseEmailNotificationPreferenceResult {
  const { user, isReady } = useAuth();
  const userId = user?.id ?? null;
  const [state, setState] = useState(EMPTY_STATE);
  const [reloadVersion, setReloadVersion] = useState(0);

  useEffect(() => {
    if (!userId || !isReady) return;
    const client = getSupabaseBrowserClient();
    if (!client) return;
    let active = true;
    client
      .from(PROGRAM_EMAIL_PREFERENCES_TABLE)
      .select('enabled')
      .eq('user_id', userId)
      .maybeSingle()
      .then(
        ({ data, error }) => {
          if (!active) return;
          setState({
            userId,
            enabled: data?.enabled ?? false,
            isLoading: false,
            isSaving: false,
            error: error ? 'Pengaturan email belum dapat dimuat. Coba lagi.' : null,
          });
        },
        () => {
          if (!active) return;
          setState({
            userId,
            enabled: false,
            isLoading: false,
            isSaving: false,
            error: 'Pengaturan email belum dapat dimuat. Coba lagi.',
          });
        },
      );
    return () => {
      active = false;
    };
  }, [isReady, reloadVersion, userId]);

  const current = state.userId === userId ? state : { ...EMPTY_STATE, userId, isLoading: !!userId };

  async function setEnabled(enabled: boolean): Promise<void> {
    if (!userId || current.isLoading || current.isSaving || current.error) return;
    const client = getSupabaseBrowserClient();
    if (!client) return;
    setState({ ...current, isSaving: true });
    let hasError = false;
    try {
      const { error } = await client.from(PROGRAM_EMAIL_PREFERENCES_TABLE).upsert({
        user_id: userId,
        enabled,
      });
      hasError = !!error;
    } catch {
      hasError = true;
    }
    setState((previous) =>
      previous.userId === userId
        ? {
            ...previous,
            enabled: hasError ? previous.enabled : enabled,
            isSaving: false,
            error: hasError ? 'Pengaturan email belum tersimpan. Coba lagi.' : null,
          }
        : previous,
    );
  }

  return {
    ...current,
    setEnabled,
    retry: () => setReloadVersion((version) => version + 1),
  };
}
