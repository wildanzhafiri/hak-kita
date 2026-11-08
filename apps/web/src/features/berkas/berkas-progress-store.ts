'use client';

import {
  EMPTY_BERKAS_PROGRESS,
  hasBerkasProgress,
  parseBerkasProgress,
  type BerkasProgress,
} from '@hakkita/domain';
import { BERKAS_PROGRESS_TABLE } from '@/config/auth';
import { BERKAS_STORAGE_PREFIX } from '@/config/storage';
import { getSupabaseBrowserClient } from '@/lib/supabase/client';
import { BERKAS_PROGRESS_ERRORS } from './content';
import type { BerkasProgressSnapshot } from './types';

const EMPTY_SNAPSHOT: BerkasProgressSnapshot = {
  ...EMPTY_BERKAS_PROGRESS,
  isLoading: false,
  isSaving: false,
  error: null,
};
const LOADING_SNAPSHOT: BerkasProgressSnapshot = { ...EMPTY_SNAPSHOT, isLoading: true };
const snapshots = new Map<string, BerkasProgressSnapshot>();
const listeners = new Map<string, Set<() => void>>();
const allListeners = new Set<() => void>();
const loadingKeys = new Set<string>();
const loadedKeys = new Set<string>();
const writeQueue = new Map<string, Promise<void>>();
let revision = 0;

function getKey(userId: string, programId: string): string {
  return `${userId}:${programId}`;
}

function publish(key: string, snapshot: BerkasProgressSnapshot): void {
  snapshots.set(key, snapshot);
  revision += 1;
  listeners.get(key)?.forEach((listener) => listener());
  allListeners.forEach((listener) => listener());
}

function readLocalProgress(programId: string): BerkasProgress {
  try {
    return parseBerkasProgress(window.localStorage.getItem(`${BERKAS_STORAGE_PREFIX}${programId}`));
  } catch {
    return EMPTY_BERKAS_PROGRESS;
  }
}

function clearLocalProgress(programId: string): void {
  const storageKey = `${BERKAS_STORAGE_PREFIX}${programId}`;
  try {
    window.localStorage.removeItem(storageKey);
    window.dispatchEvent(new StorageEvent('storage', { key: storageKey }));
  } catch {
    return;
  }
}

function isSafeProgress(progress: BerkasProgress): boolean {
  return (
    !/[0-9]{16}/.test(JSON.stringify(progress.answers)) &&
    !/[0-9](?:[\s.-]*[0-9]){15}/.test(progress.note)
  );
}

function enqueueWrite(key: string, operation: () => Promise<boolean>, failure: string): void {
  const previous = writeQueue.get(key) ?? Promise.resolve();
  const next = previous.then(async () => {
    try {
      const succeeded = await operation();
      publish(key, {
        ...(snapshots.get(key) ?? EMPTY_SNAPSHOT),
        error: succeeded ? null : failure,
      });
    } catch {
      publish(key, { ...(snapshots.get(key) ?? EMPTY_SNAPSHOT), error: failure });
    }
  });
  writeQueue.set(key, next);
  void next.then(() => {
    if (writeQueue.get(key) !== next) return;
    writeQueue.delete(key);
    publish(key, { ...(snapshots.get(key) ?? EMPTY_SNAPSHOT), isSaving: false });
  });
}

export function mergeCheckedItemIds(
  accountIds: readonly string[],
  localIds: readonly string[],
): string[] {
  return [...new Set([...accountIds, ...localIds])];
}

export function getBerkasProgressRevision(): number {
  return revision;
}

export function subscribeAllBerkasProgress(listener: () => void): () => void {
  allListeners.add(listener);
  return () => allListeners.delete(listener);
}

export function getBerkasProgressSnapshot(
  userId: string | null,
  programId: string,
): BerkasProgressSnapshot {
  if (!userId) return EMPTY_SNAPSHOT;
  return snapshots.get(getKey(userId, programId)) ?? LOADING_SNAPSHOT;
}

export function subscribeBerkasProgress(
  userId: string | null,
  programId: string,
  listener: () => void,
): () => void {
  if (!userId) return () => undefined;
  const key = getKey(userId, programId);
  const keyListeners = listeners.get(key) ?? new Set<() => void>();
  keyListeners.add(listener);
  listeners.set(key, keyListeners);
  return () => {
    keyListeners.delete(listener);
    if (keyListeners.size === 0) listeners.delete(key);
  };
}

export async function loadBerkasProgress(userId: string, programId: string): Promise<void> {
  const key = getKey(userId, programId);
  if (loadingKeys.has(key) || writeQueue.has(key)) return;
  const client = getSupabaseBrowserClient();
  if (!client) {
    publish(key, { ...LOADING_SNAPSHOT, error: BERKAS_PROGRESS_ERRORS.notConnected });
    return;
  }

  loadingKeys.add(key);
  publish(key, { ...(snapshots.get(key) ?? LOADING_SNAPSHOT), isLoading: true, error: null });
  try {
    const { data, error } = await client
      .from(BERKAS_PROGRESS_TABLE)
      .select('answers,checked_item_ids,details_updated_at,note')
      .eq('user_id', userId)
      .eq('program_id', programId)
      .maybeSingle();
    if (error) {
      publish(key, { ...LOADING_SNAPSHOT, error: BERKAS_PROGRESS_ERRORS.load });
      return;
    }

    const account = parseBerkasProgress(
      data
        ? JSON.stringify({
            answers: data.answers,
            checked: data.checked_item_ids,
            note: data.note,
          })
        : null,
    );
    const local = readLocalProgress(programId);
    if (hasBerkasProgress(local) && !isSafeProgress(local)) {
      loadedKeys.add(key);
      publish(key, {
        ...EMPTY_SNAPSHOT,
        ...account,
        error: BERKAS_PROGRESS_ERRORS.localPrivateData,
      });
      return;
    }

    const merged: BerkasProgress = {
      answers: data?.details_updated_at ? account.answers : local.answers,
      checked: mergeCheckedItemIds(account.checked, local.checked),
      note: data?.details_updated_at ? account.note : local.note,
    };
    if (hasBerkasProgress(local)) {
      const { error: mergeError } = await client.from(BERKAS_PROGRESS_TABLE).upsert(
        {
          user_id: userId,
          program_id: programId,
          answers: merged.answers,
          checked_item_ids: merged.checked,
          details_updated_at: new Date().toISOString(),
          note: merged.note,
          updated_at: new Date().toISOString(),
        },
        { onConflict: 'user_id,program_id' },
      );
      if (mergeError) {
        publish(key, { ...LOADING_SNAPSHOT, error: BERKAS_PROGRESS_ERRORS.merge });
        return;
      }
      clearLocalProgress(programId);
    }
    loadedKeys.add(key);
    publish(key, { ...EMPTY_SNAPSHOT, ...merged });
  } catch {
    publish(key, { ...LOADING_SNAPSHOT, error: BERKAS_PROGRESS_ERRORS.load });
  } finally {
    loadingKeys.delete(key);
  }
}

export function saveBerkasProgress(
  userId: string,
  programId: string,
  progress: BerkasProgress,
): void {
  const key = getKey(userId, programId);
  const current = getBerkasProgressSnapshot(userId, programId);
  if (current.isLoading || !loadedKeys.has(key)) return;
  if (!isSafeProgress(progress)) {
    publish(key, { ...current, error: BERKAS_PROGRESS_ERRORS.privateData });
    return;
  }
  const client = getSupabaseBrowserClient();
  if (!client) {
    publish(key, { ...current, error: BERKAS_PROGRESS_ERRORS.notConnected });
    return;
  }

  publish(key, { ...current, ...progress, isSaving: true, error: null });
  enqueueWrite(
    key,
    async () => {
      const { error } = await client.from(BERKAS_PROGRESS_TABLE).upsert(
        {
          user_id: userId,
          program_id: programId,
          answers: progress.answers,
          checked_item_ids: progress.checked,
          details_updated_at: new Date().toISOString(),
          note: progress.note,
          updated_at: new Date().toISOString(),
        },
        { onConflict: 'user_id,program_id' },
      );
      return !error;
    },
    BERKAS_PROGRESS_ERRORS.save,
  );
}

export function clearBerkasProgress(userId: string, programId: string): void {
  const key = getKey(userId, programId);
  const current = getBerkasProgressSnapshot(userId, programId);
  if (current.isLoading || !loadedKeys.has(key)) return;
  const client = getSupabaseBrowserClient();
  if (!client) {
    publish(key, { ...current, error: BERKAS_PROGRESS_ERRORS.notConnected });
    return;
  }

  publish(key, { ...EMPTY_SNAPSHOT, isSaving: true });
  enqueueWrite(
    key,
    async () => {
      const { error } = await client
        .from(BERKAS_PROGRESS_TABLE)
        .delete()
        .eq('user_id', userId)
        .eq('program_id', programId);
      return !error;
    },
    BERKAS_PROGRESS_ERRORS.clear,
  );
}
