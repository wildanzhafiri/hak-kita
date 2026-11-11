import 'server-only';
import { EMPTY_PREFERENCES } from '@hakkita/domain';
import { PreferensiProfilSchema } from '@hakkita/schema';
import { USER_PROFILES_TABLE } from '@/config/auth';
import { createUserClient } from './current-user';
import type { UserProfileResult } from './types';

export async function loadUserProfileServer(): Promise<UserProfileResult> {
  const client = await createUserClient();
  if (!client) return { status: 'anonymous' };

  const { data: userData, error: userError } = await client.auth.getUser();
  if (userError || !userData.user) return { status: 'anonymous' };

  const { data, error } = await client
    .from(USER_PROFILES_TABLE)
    .select('display_name,preferences')
    .eq('user_id', userData.user.id)
    .maybeSingle();
  if (error) return { status: 'error' };

  const parsed = PreferensiProfilSchema.safeParse(data?.preferences);
  return {
    status: 'ready',
    nama: data?.display_name ?? '',
    preferensi: parsed.success ? parsed.data : EMPTY_PREFERENCES,
  };
}
