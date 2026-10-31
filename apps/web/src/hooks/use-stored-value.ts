'use client';

import { useCallback, useMemo, useSyncExternalStore } from 'react';

const listeners = new Set<() => void>();
const fallback = new Map<string, string>();

function subscribe(listener: () => void): () => void {
  listeners.add(listener);
  window.addEventListener('storage', listener);
  return () => {
    listeners.delete(listener);
    window.removeEventListener('storage', listener);
  };
}

function read(key: string): string | null {
  const unsaved = fallback.get(key);
  if (unsaved !== undefined) return unsaved;
  try {
    return window.localStorage.getItem(key);
  } catch {
    return null;
  }
}

function write(key: string, value: string): void {
  try {
    window.localStorage.setItem(key, value);
    fallback.delete(key);
  } catch {
    fallback.set(key, value);
  }
  listeners.forEach((listener) => listener());
}

export function useStoredValue(key: string): [string | null, (value: string) => void] {
  const value = useSyncExternalStore(
    subscribe,
    () => read(key),
    () => null,
  );
  const store = useCallback((next: string) => write(key, next), [key]);
  return [value, store];
}

export function useStoredValues(
  keys: readonly string[],
): [(string | null)[], (key: string, value: string) => void] {
  const snapshot = useSyncExternalStore(
    subscribe,
    () => JSON.stringify(keys.map(read)),
    () => JSON.stringify(keys.map(() => null)),
  );
  const values = useMemo(() => JSON.parse(snapshot) as (string | null)[], [snapshot]);
  return [values, write];
}
