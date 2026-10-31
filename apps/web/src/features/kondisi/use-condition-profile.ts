'use client';

import { useMemo } from 'react';
import { ProfileSchema, type Profile } from '@hakkita/schema';
import { CONDITION_STORAGE_KEY } from '@/config/storage';
import { useStoredValue } from '@/hooks/use-stored-value';
import { EMPTY_PROFILE } from './constants';
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
  const [raw, store] = useStoredValue(CONDITION_STORAGE_KEY);
  const profile = useMemo(() => parseProfile(raw), [raw]);
  return {
    profile,
    update: (changes) => store(JSON.stringify({ ...profile, ...changes })),
    reset: () => store(JSON.stringify(EMPTY_PROFILE)),
  };
}
