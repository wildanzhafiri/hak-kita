import 'server-only';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import type { Database } from '@/lib/supabase/types';
import type { RadarAccessState } from './types';

export async function getRadarAccessState(): Promise<RadarAccessState> {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
  if (!url || !key) return { status: 'unconfigured' };

  const cookieStore = await cookies();
  const client = createServerClient<Database>(url, key, {
    cookies: {
      getAll: () => cookieStore.getAll(),
      setAll: () => undefined,
    },
  });
  const { data, error } = await client.auth.getUser();
  if (error || !data.user) return { status: 'anonymous' };
  if (!data.user.email_confirmed_at) return { status: 'forbidden' };

  const { data: userRole, error: roleError } = await client
    .from('user_roles')
    .select('role')
    .eq('user_id', data.user.id)
    .maybeSingle();

  if (roleError) return { status: 'unconfigured' };
  if (userRole?.role !== 'admin') return { status: 'forbidden' };

  return { status: 'authorized', userId: data.user.id, email: data.user.email ?? '' };
}

export async function getRadarAdminId(): Promise<string | null> {
  const access = await getRadarAccessState();
  return access.status === 'authorized' ? access.userId : null;
}
