'use client';

import { EMPTY_PREFERENCES } from '@hakkita/domain';
import { PreferensiProfilSchema, type PreferensiProfil } from '@hakkita/schema';
import { USER_PROFILES_TABLE } from '@/config/auth';
import { getSupabaseBrowserClient } from '@/lib/supabase/client';
import { PROFILE_COPY } from './content';
import type { ProfileStoreResult } from './types';

function emptyResult(error: string | null): ProfileStoreResult {
  return { nama: '', preferensi: EMPTY_PREFERENCES, error };
}

export async function loadUserProfile(userId: string): Promise<ProfileStoreResult> {
  const client = getSupabaseBrowserClient();
  if (!client) return emptyResult(PROFILE_COPY.loadError);

  try {
    const { data, error } = await client
      .from(USER_PROFILES_TABLE)
      .select('display_name,preferences')
      .eq('user_id', userId)
      .maybeSingle();
    if (error) return emptyResult(PROFILE_COPY.loadError);
    if (!data) return emptyResult(null);
    const parsed = PreferensiProfilSchema.safeParse(data.preferences);
    return {
      nama: data.display_name,
      preferensi: parsed.success ? parsed.data : EMPTY_PREFERENCES,
      error: null,
    };
  } catch {
    return emptyResult(PROFILE_COPY.loadError);
  }
}

export async function saveUserProfile(
  userId: string,
  nama: string,
  preferensi: PreferensiProfil,
): Promise<string | null> {
  const client = getSupabaseBrowserClient();
  if (!client) return PROFILE_COPY.saveError;

  try {
    const { error } = await client.from(USER_PROFILES_TABLE).upsert(
      {
        user_id: userId,
        display_name: nama,
        preferences: preferensi,
        updated_at: new Date().toISOString(),
      },
      { onConflict: 'user_id' },
    );
    return error ? PROFILE_COPY.saveError : null;
  } catch {
    return PROFILE_COPY.saveError;
  }
}

export async function clearUserPreferences(userId: string, nama: string): Promise<string | null> {
  const client = getSupabaseBrowserClient();
  if (!client) return PROFILE_COPY.clearError;

  try {
    const { error } = await client.from(USER_PROFILES_TABLE).upsert(
      {
        user_id: userId,
        display_name: nama,
        preferences: {},
        updated_at: new Date().toISOString(),
      },
      { onConflict: 'user_id' },
    );
    return error ? PROFILE_COPY.clearError : null;
  } catch {
    return PROFILE_COPY.clearError;
  }
}
