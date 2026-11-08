'use client';

import { parseSavedIds } from '@hakkita/domain';
import { SAVED_PROGRAMS_TABLE } from '@/config/auth';
import { SAVED_STORAGE_KEY } from '@/config/storage';
import { getSupabaseBrowserClient } from '@/lib/supabase/client';
import type { SavedProgramsSnapshot } from './types';

const EMPTY_SNAPSHOT: SavedProgramsSnapshot = {
  ids: [],
  isLoading: false,
  isSaving: false,
  error: null,
};

const LOADING_SNAPSHOT: SavedProgramsSnapshot = {
  ...EMPTY_SNAPSHOT,
  isLoading: true,
};

const snapshots = new Map<string, SavedProgramsSnapshot>();
const listeners = new Map<string, Set<() => void>>();
const loadingUsers = new Set<string>();
const loadedUsers = new Set<string>();
const mutationVersions = new Map<string, number>();

function publish(userId: string, snapshot: SavedProgramsSnapshot): void {
  snapshots.set(userId, snapshot);
  listeners.get(userId)?.forEach((listener) => listener());
}

export function getSavedProgramsSnapshot(userId: string | null): SavedProgramsSnapshot {
  if (!userId) return EMPTY_SNAPSHOT;
  return snapshots.get(userId) ?? LOADING_SNAPSHOT;
}

export function subscribeSavedPrograms(userId: string | null, listener: () => void): () => void {
  if (!userId) return () => undefined;
  const userListeners = listeners.get(userId) ?? new Set<() => void>();
  userListeners.add(listener);
  listeners.set(userId, userListeners);
  return () => {
    userListeners.delete(listener);
    if (userListeners.size === 0) listeners.delete(userId);
  };
}

export async function loadSavedPrograms(userId: string): Promise<void> {
  if (loadingUsers.has(userId) || loadedUsers.has(userId)) return;
  const client = getSupabaseBrowserClient();
  if (!client) {
    publish(userId, { ...EMPTY_SNAPSHOT, error: 'Akun belum terhubung ke Supabase.' });
    return;
  }

  loadingUsers.add(userId);
  publish(userId, { ...getSavedProgramsSnapshot(userId), isLoading: true, error: null });
  const requestVersion = mutationVersions.get(userId) ?? 0;
  let previousIds: string[] = [];
  let migrationError = false;
  try {
    previousIds = parseSavedIds(window.localStorage.getItem(SAVED_STORAGE_KEY));
  } catch {
    previousIds = [];
  }

  let savedIds: string[] | null = null;
  try {
    if (previousIds.length > 0) {
      try {
        const { error } = await client.from(SAVED_PROGRAMS_TABLE).upsert(
          previousIds.map((programId) => ({ user_id: userId, program_id: programId })),
          { onConflict: 'user_id,program_id', ignoreDuplicates: true },
        );
        migrationError = error !== null;
      } catch {
        migrationError = true;
      }
      if (!migrationError) {
        try {
          window.localStorage.removeItem(SAVED_STORAGE_KEY);
        } catch {
          migrationError = true;
        }
      }
    }

    const { data, error } = await client
      .from(SAVED_PROGRAMS_TABLE)
      .select('program_id')
      .eq('user_id', userId)
      .order('created_at');
    if (!error && data) savedIds = data.map(({ program_id }) => program_id);
  } catch {
    savedIds = null;
  } finally {
    loadingUsers.delete(userId);
  }
  if (requestVersion !== (mutationVersions.get(userId) ?? 0)) {
    await loadSavedPrograms(userId);
    return;
  }
  if (!savedIds) {
    publish(userId, {
      ...EMPTY_SNAPSHOT,
      error: 'Simpanan akun belum dapat dimuat. Coba lagi.',
    });
    return;
  }

  loadedUsers.add(userId);
  publish(userId, {
    ...EMPTY_SNAPSHOT,
    ids: savedIds,
    error: migrationError ? 'Simpanan di perangkat ini belum berhasil dipindahkan ke akun.' : null,
  });
}

export async function retrySavedPrograms(userId: string): Promise<void> {
  loadedUsers.delete(userId);
  await loadSavedPrograms(userId);
}

export async function toggleSavedProgram(userId: string, programId: string): Promise<void> {
  const current = getSavedProgramsSnapshot(userId);
  if (current.isLoading || current.isSaving) return;
  const client = getSupabaseBrowserClient();
  if (!client) {
    publish(userId, { ...current, error: 'Akun belum terhubung ke Supabase.' });
    return;
  }

  const wasSaved = current.ids.includes(programId);
  mutationVersions.set(userId, (mutationVersions.get(userId) ?? 0) + 1);
  const nextIds = wasSaved
    ? current.ids.filter((id) => id !== programId)
    : [...current.ids, programId];
  publish(userId, { ...current, ids: nextIds, isSaving: true, error: null });
  let failed = false;
  try {
    const result = wasSaved
      ? await client
          .from(SAVED_PROGRAMS_TABLE)
          .delete()
          .eq('user_id', userId)
          .eq('program_id', programId)
      : await client.from(SAVED_PROGRAMS_TABLE).insert({ user_id: userId, program_id: programId });
    failed = result.error !== null;
  } catch {
    failed = true;
  }
  publish(
    userId,
    failed
      ? {
          ...current,
          isSaving: false,
          error: 'Perubahan simpanan belum berhasil. Coba lagi.',
        }
      : { ...current, ids: nextIds, isSaving: false },
  );
}

export async function clearSavedPrograms(userId: string): Promise<void> {
  const current = getSavedProgramsSnapshot(userId);
  if (current.isLoading || current.isSaving) return;
  const client = getSupabaseBrowserClient();
  if (!client) {
    publish(userId, { ...current, error: 'Akun belum terhubung ke Supabase.' });
    return;
  }

  mutationVersions.set(userId, (mutationVersions.get(userId) ?? 0) + 1);
  publish(userId, { ...current, ids: [], isSaving: true, error: null });
  let failed = false;
  try {
    const { error } = await client.from(SAVED_PROGRAMS_TABLE).delete().eq('user_id', userId);
    failed = error !== null;
  } catch {
    failed = true;
  }
  publish(
    userId,
    failed
      ? { ...current, isSaving: false, error: 'Simpanan belum dapat dihapus. Coba lagi.' }
      : { ...EMPTY_SNAPSHOT },
  );
}

export function markSavedProgram(userId: string, programId: string): void {
  const current = getSavedProgramsSnapshot(userId);
  if (current.ids.includes(programId)) return;
  mutationVersions.set(userId, (mutationVersions.get(userId) ?? 0) + 1);
  publish(userId, { ...current, ids: [...current.ids, programId] });
}
