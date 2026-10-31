'use client';

import { useCallback, useMemo } from 'react';
import { parseSavedIds, serializeSavedIds, toggleSavedId } from '@hakkita/domain';
import { SAVED_STORAGE_KEY } from '@/config/storage';
import type { UseSavedIdsResult } from './types';
import { useStoredValue } from './use-stored-value';

export function useSavedIds(): UseSavedIdsResult {
  const [raw, store] = useStoredValue(SAVED_STORAGE_KEY);
  const ids = useMemo(() => parseSavedIds(raw), [raw]);

  const toggle = useCallback(
    (id: string) => store(serializeSavedIds(toggleSavedId(ids, id))),
    [ids, store],
  );
  const clear = useCallback(() => store(serializeSavedIds([])), [store]);

  return { ids, toggle, clear };
}
