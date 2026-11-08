'use client';

import { useEffect, useState } from 'react';
import { createProgramFollowSnapshot, todayWIB } from '@hakkita/domain';
import type { Program } from '@hakkita/schema';
import { PROGRAM_FOLLOWS_TABLE } from '@/config/auth';
import { getSupabaseBrowserClient } from '@/lib/supabase/client';
import type { ProgramFollowState, UseProgramFollowsResult } from './types';
import { useAuth } from './use-auth';

const EMPTY_STATE: ProgramFollowState = {
  userId: null,
  rows: [],
  isLoading: false,
  busyProgramId: null,
  error: null,
};

export function useProgramFollows(): UseProgramFollowsResult {
  const { user, isReady, isConfigured } = useAuth();
  const userId = user?.id ?? null;
  const [state, setState] = useState<ProgramFollowState>(EMPTY_STATE);
  const [reloadVersion, setReloadVersion] = useState(0);

  useEffect(() => {
    if (!userId || !isReady) return;
    const client = getSupabaseBrowserClient();
    if (!client) return;
    let active = true;
    client
      .from(PROGRAM_FOLLOWS_TABLE)
      .select('user_id,program_id,snapshot,created_at,updated_at')
      .eq('user_id', userId)
      .order('created_at')
      .then(
        ({ data, error }) => {
          if (!active) return;
          setState({
            userId,
            rows: data ?? [],
            isLoading: false,
            busyProgramId: null,
            error: error ? 'Program yang diikuti belum dapat dimuat. Coba lagi.' : null,
          });
        },
        () => {
          if (!active) return;
          setState({
            userId,
            rows: [],
            isLoading: false,
            busyProgramId: null,
            error: 'Program yang diikuti belum dapat dimuat. Coba lagi.',
          });
        },
      );
    return () => {
      active = false;
    };
  }, [isReady, reloadVersion, userId]);

  const current = state.userId === userId ? state : { ...EMPTY_STATE, userId, isLoading: !!userId };

  async function follow(program: Program): Promise<void> {
    if (!userId || current.isLoading || current.busyProgramId) return;
    const client = getSupabaseBrowserClient();
    if (!client) return;
    setState({ ...current, busyProgramId: program.id, error: null });
    try {
      const { data, error } = await client
        .from(PROGRAM_FOLLOWS_TABLE)
        .insert({
          user_id: userId,
          program_id: program.id,
          snapshot: createProgramFollowSnapshot(program, todayWIB()),
        })
        .select('user_id,program_id,snapshot,created_at,updated_at')
        .single();
      if (error || !data) throw error;
      setState((previous) =>
        previous.userId === userId
          ? { ...previous, rows: [...previous.rows, data], busyProgramId: null }
          : previous,
      );
    } catch {
      setState((previous) =>
        previous.userId === userId
          ? {
              ...previous,
              busyProgramId: null,
              error: 'Program belum berhasil diikuti. Coba lagi.',
            }
          : previous,
      );
    }
  }

  async function unfollow(programId: string): Promise<void> {
    if (!userId || current.isLoading || current.busyProgramId) return;
    const client = getSupabaseBrowserClient();
    if (!client) return;
    setState({ ...current, busyProgramId: programId, error: null });
    try {
      const { error } = await client
        .from(PROGRAM_FOLLOWS_TABLE)
        .delete()
        .eq('user_id', userId)
        .eq('program_id', programId);
      if (error) throw error;
      setState((previous) =>
        previous.userId === userId
          ? {
              ...previous,
              rows: previous.rows.filter((row) => row.program_id !== programId),
              busyProgramId: null,
            }
          : previous,
      );
    } catch {
      setState((previous) =>
        previous.userId === userId
          ? {
              ...previous,
              busyProgramId: null,
              error: 'Belum berhasil berhenti mengikuti. Coba lagi.',
            }
          : previous,
      );
    }
  }

  async function markSeen(program: Program): Promise<void> {
    if (!userId || current.isLoading || current.busyProgramId) return;
    const client = getSupabaseBrowserClient();
    if (!client) return;
    setState({ ...current, busyProgramId: program.id, error: null });
    const snapshot = createProgramFollowSnapshot(program, todayWIB());
    try {
      const { error } = await client
        .from(PROGRAM_FOLLOWS_TABLE)
        .update({ snapshot, updated_at: new Date().toISOString() })
        .eq('user_id', userId)
        .eq('program_id', program.id);
      if (error) throw error;
      setState((previous) =>
        previous.userId === userId
          ? {
              ...previous,
              rows: previous.rows.map((row) =>
                row.program_id === program.id ? { ...row, snapshot } : row,
              ),
              busyProgramId: null,
            }
          : previous,
      );
    } catch {
      setState((previous) =>
        previous.userId === userId
          ? {
              ...previous,
              busyProgramId: null,
              error: 'Pembaruan belum dapat ditandai sudah dibaca. Coba lagi.',
            }
          : previous,
      );
    }
  }

  return {
    ...current,
    isLoading: current.isLoading || (isConfigured && !isReady),
    isSignedIn: !!userId,
    isConfigured,
    follow,
    unfollow,
    markSeen,
    retry: () => setReloadVersion((version) => version + 1),
  };
}
