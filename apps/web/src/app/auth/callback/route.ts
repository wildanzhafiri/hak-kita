import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { NextResponse, type NextRequest } from 'next/server';
import { SAVED_PROGRAMS_TABLE } from '@/config/auth';
import { safeAuthPath } from '@/features/auth/safe-auth-path';
import type { Database } from '@/lib/supabase/types';

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get('code');
  const providerError = requestUrl.searchParams.get('error');
  const nextPath = safeAuthPath(requestUrl.searchParams.get('next'));
  const saveProgramId = requestUrl.searchParams.get('save');
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

  if (providerError) {
    return NextResponse.redirect(new URL('/masuk?error=oauth', requestUrl.origin));
  }

  if (!code || !url || !key) {
    return NextResponse.redirect(new URL('/masuk?error=callback', requestUrl.origin));
  }

  const cookieStore = await cookies();
  const supabase = createServerClient<Database>(url, key, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value, options }) => cookieStore.set(name, value, options));
      },
    },
  });

  const { error } = await supabase.auth.exchangeCodeForSession(code);
  if (error) return NextResponse.redirect(new URL('/masuk?error=callback', requestUrl.origin));

  if (saveProgramId && /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(saveProgramId)) {
    const { data } = await supabase.auth.getUser();
    if (data.user) {
      await supabase
        .from(SAVED_PROGRAMS_TABLE)
        .upsert(
          { user_id: data.user.id, program_id: saveProgramId },
          { onConflict: 'user_id,program_id', ignoreDuplicates: true },
        );
    }
  }

  return NextResponse.redirect(new URL(nextPath, requestUrl.origin));
}
