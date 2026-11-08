'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useState, type FormEvent } from 'react';
import { Button } from '@/components/ui/button';
import { TextInput } from '@/components/ui/text-input';
import { SAVED_PROGRAMS_TABLE } from '@/config/auth';
import { markSavedProgram } from '@/hooks/saved-program-store';
import { getSupabaseBrowserClient, isSupabaseConfigured } from '@/lib/supabase/client';
import { AUTH_CALLBACK_PATH, MIN_PASSWORD_LENGTH } from './constants';
import { AUTH_ERROR_COPY, AUTH_FORM_COPY } from './content';
import type { AuthFormProps } from './types';

function authErrorMessage(message: string): string {
  if (message.includes('Invalid login credentials')) return AUTH_ERROR_COPY.invalidCredentials;
  if (message.includes('already registered')) return AUTH_ERROR_COPY.emailTaken;
  if (message.toLowerCase().includes('password')) return AUTH_ERROR_COPY.weakPassword;
  return AUTH_ERROR_COPY.generic;
}

function buildRedirectPath(nextPath: string, saveProgramId: string | null): string {
  const params = new URLSearchParams({ next: nextPath });
  if (saveProgramId) params.set('save', saveProgramId);
  return `${AUTH_CALLBACK_PATH}?${params.toString()}`;
}

export function AuthForm({ mode, nextPath, saveProgramId, initialMessage }: AuthFormProps) {
  const router = useRouter();
  const copy = AUTH_FORM_COPY[mode];
  const [message, setMessage] = useState<string | null>(initialMessage);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const isConfigured = isSupabaseConfigured();
  const switchMode = mode === 'login' ? 'daftar' : 'masuk';
  const switchHref = `/${switchMode}?${new URLSearchParams({ next: nextPath, ...(saveProgramId ? { save: saveProgramId } : {}) }).toString()}`;

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const client = getSupabaseBrowserClient();
    if (!client) return;
    const form = new FormData(event.currentTarget);
    const email = String(form.get('email') ?? '').trim();
    const password = String(form.get('password') ?? '');
    if (mode === 'signup' && password.length < MIN_PASSWORD_LENGTH) {
      setMessage(AUTH_ERROR_COPY.weakPassword);
      return;
    }

    setIsSubmitting(true);
    setMessage(null);
    const result =
      mode === 'login'
        ? await client.auth.signInWithPassword({ email, password })
        : await client.auth.signUp({
            email,
            password,
            options: {
              emailRedirectTo: new URL(
                buildRedirectPath(nextPath, saveProgramId),
                window.location.origin,
              ).toString(),
            },
          });

    if (result.error) {
      setMessage(authErrorMessage(result.error.message));
      setIsSubmitting(false);
      return;
    }

    if (mode === 'signup' && !result.data.session) {
      setMessage('Periksa emailmu untuk mengonfirmasi pendaftaran sebelum masuk.');
      setIsSubmitting(false);
      return;
    }

    if (saveProgramId && result.data.user) {
      const { error } = await client
        .from(SAVED_PROGRAMS_TABLE)
        .upsert(
          { user_id: result.data.user.id, program_id: saveProgramId },
          { onConflict: 'user_id,program_id', ignoreDuplicates: true },
        );
      if (error) {
        setMessage(AUTH_ERROR_COPY.saveFailed);
        setIsSubmitting(false);
        return;
      }
      markSavedProgram(result.data.user.id, saveProgramId);
    }

    router.replace(nextPath);
    router.refresh();
  }

  async function handleGoogleSignIn() {
    const client = getSupabaseBrowserClient();
    if (!client) return;

    setIsSubmitting(true);
    setMessage(null);

    try {
      const { error } = await client.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: new URL(
            buildRedirectPath(nextPath, saveProgramId),
            window.location.origin,
          ).toString(),
        },
      });

      if (error) {
        setMessage(AUTH_ERROR_COPY.oauth);
        setIsSubmitting(false);
      }
    } catch {
      setMessage(AUTH_ERROR_COPY.oauth);
      setIsSubmitting(false);
    }
  }

  return (
    <section className="mx-auto max-w-[520px] rounded-xl border border-[#dce1e6] bg-white p-7 max-[640px]:p-5">
      <h2 className="text-2xl font-bold tracking-[-0.03em] text-[#1b304c]">{copy.title}</h2>
      <p className="mt-2 text-sm leading-6 text-[#617087]">{copy.description}</p>
      {!isConfigured ? (
        <p
          className="mt-6 rounded-lg border border-[#dce1e6] bg-[#f5f8fc] p-4 text-sm leading-6 text-[#526173]"
          role="status"
        >
          Fitur akun belum terhubung. Admin HAKKITA perlu menambahkan URL dan publishable key
          Supabase.
        </p>
      ) : (
        <>
          <Button
            className="mt-6 w-full border-[#dce1e6] !bg-white !text-[#25354b] hover:!bg-[#f7f9fc]"
            isDisabled={isSubmitting}
            onPress={handleGoogleSignIn}
            tone="secondary"
          >
            <Image src="/google-g-logo.png" alt="" width={20} height={20} />
            {isSubmitting ? 'Menghubungkan ke Google' : copy.googleLabel}
          </Button>
          <div className="my-5 flex items-center gap-3 text-xs text-[#77808c]">
            <span className="h-px flex-1 bg-[#e2e7ed]" />
            <span>{copy.emailDivider}</span>
            <span className="h-px flex-1 bg-[#e2e7ed]" />
          </div>
          <form className="grid gap-4" onSubmit={handleSubmit}>
            <div className="grid gap-2">
              <label className="text-sm font-medium text-[#25354b]" htmlFor="auth-email">
                Email
              </label>
              <TextInput
                autoComplete="email"
                id="auth-email"
                name="email"
                required
                type="email"
              />
            </div>
            <div className="grid gap-2">
              <label className="text-sm font-medium text-[#25354b]" htmlFor="auth-password">
                Kata sandi
              </label>
              <TextInput
                autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
                id="auth-password"
                minLength={mode === 'signup' ? MIN_PASSWORD_LENGTH : undefined}
                name="password"
                required
                type="password"
              />
            </div>
            {message && (
              <p
                className="rounded-lg bg-[#f5f8fc] px-3 py-2 text-sm leading-6 text-[#526173]"
                role="status"
              >
                {message}
              </p>
            )}
            <Button className="w-full" isDisabled={isSubmitting} type="submit">
              {isSubmitting ? 'Memproses' : copy.submit}
            </Button>
          </form>
        </>
      )}
      <p className="mt-5 text-center text-sm text-[#617087]">
        {copy.switchLabel}{' '}
        <Link
          className="font-semibold text-[#196dcc] underline underline-offset-4"
          href={switchHref}
        >
          {copy.switchAction}
        </Link>
      </p>
      <p className="mt-4 text-center text-xs leading-5 text-[#77808c]">
        HAKKITA tidak meminta NIK atau dokumen pribadi.
      </p>
    </section>
  );
}
