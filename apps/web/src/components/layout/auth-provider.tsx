'use client';

import { useEffect, useState } from 'react';
import type { User } from '@supabase/supabase-js';
import { getSupabaseBrowserClient, isSupabaseConfigured } from '@/lib/supabase/client';
import { AuthContext } from '@/hooks/use-auth';
import { SavedProgramsNotice } from '@/components/program/saved-programs-notice';
import type { AuthState } from '@/hooks/types';
import type { AuthProviderProps } from './types';

export function AuthProvider({ children }: AuthProviderProps) {
  const isConfigured = isSupabaseConfigured();
  const [state, setState] = useState<AuthState>({
    user: null,
    isReady: !isConfigured,
    isConfigured,
  });

  useEffect(() => {
    const client = getSupabaseBrowserClient();
    if (!client) return;

    let currentUser: User | null = null;
    let hasAuthEvent = false;
    const { data } = client.auth.onAuthStateChange((_event, session) => {
      hasAuthEvent = true;
      currentUser = session?.user ?? null;
      setState({ user: currentUser, isReady: true, isConfigured: true });
    });

    void client.auth.getUser().then(({ data: result }) => {
      if (!hasAuthEvent) {
        setState({ user: result.user, isReady: true, isConfigured: true });
      }
    });

    return () => data.subscription.unsubscribe();
  }, []);

  return (
    <AuthContext.Provider value={state}>
      {children}
      <SavedProgramsNotice />
    </AuthContext.Provider>
  );
}
