'use client';

import { ProfileSchema, type Profile } from '@hakkita/schema';
import { CONDITION_PROFILES_TABLE } from '@/config/auth';
import { getSupabaseBrowserClient } from '@/lib/supabase/client';
import { CONDITION_ACCOUNT_COPY } from './content';
import type { ConditionProfileStoreResult } from './types';

export async function loadAccountConditionProfile(
  userId: string,
): Promise<ConditionProfileStoreResult> {
  const client = getSupabaseBrowserClient();
  if (!client) return { profile: null, error: CONDITION_ACCOUNT_COPY.loadingError };

  try {
    const { data, error } = await client
      .from(CONDITION_PROFILES_TABLE)
      .select('profile')
      .eq('user_id', userId)
      .maybeSingle();
    if (error) return { profile: null, error: CONDITION_ACCOUNT_COPY.loadingError };
    if (!data) return { profile: null, error: null };
    const parsed = ProfileSchema.safeParse(data.profile);
    return parsed.success
      ? { profile: parsed.data, error: null }
      : { profile: null, error: CONDITION_ACCOUNT_COPY.loadingError };
  } catch {
    return { profile: null, error: CONDITION_ACCOUNT_COPY.loadingError };
  }
}

export async function saveAccountConditionProfile(
  userId: string,
  profile: Profile,
): Promise<string | null> {
  const client = getSupabaseBrowserClient();
  if (!client) return CONDITION_ACCOUNT_COPY.saveError;

  try {
    const { error } = await client
      .from(CONDITION_PROFILES_TABLE)
      .upsert(
        { user_id: userId, profile, updated_at: new Date().toISOString() },
        { onConflict: 'user_id' },
      );
    return error ? CONDITION_ACCOUNT_COPY.saveError : null;
  } catch {
    return CONDITION_ACCOUNT_COPY.saveError;
  }
}

export async function deleteAccountConditionProfile(userId: string): Promise<string | null> {
  const client = getSupabaseBrowserClient();
  if (!client) return CONDITION_ACCOUNT_COPY.deleteError;

  try {
    const { error } = await client.from(CONDITION_PROFILES_TABLE).delete().eq('user_id', userId);
    return error ? CONDITION_ACCOUNT_COPY.deleteError : null;
  } catch {
    return CONDITION_ACCOUNT_COPY.deleteError;
  }
}
