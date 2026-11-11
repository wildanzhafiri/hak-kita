'use client';

import Link from 'next/link';
import { useState, type FormEvent } from 'react';
import { Button } from '@/components/ui/button';
import { getSupabaseBrowserClient, isSupabaseConfigured } from '@/lib/supabase/client';
import { AuthTextField } from './auth-text-field';
import { AUTH_CALLBACK_PATH, GUEST_FALLBACK_PATH, RESET_PASSWORD_PATH } from './constants';
import { AUTH_RECOVERY_COPY as COPY, AUTH_SHARED_COPY as SHARED } from './content';
import { validateAuthFields } from './validate-auth-fields';

const PRIMARY_CLASSES =
  'w-full min-h-[50px] rounded-[10px] !bg-[#1769c2] text-[15px] hover:!bg-[#1458a3] disabled:!bg-[#f0f3f7] disabled:!text-[#637085]';

export function RecoveryForm() {
  const isConfigured = isSupabaseConfigured();
  const [email, setEmail] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSent, setIsSent] = useState(false);
  const isBusy = !isConfigured || isSubmitting;

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const client = getSupabaseBrowserClient();
    if (!client || isSubmitting) return;
    const validation = validateAuthFields('recovery', { name: '', email, password: '' });
    setError(validation.email ?? null);
    setMessage(null);
    if (validation.email) return;

    setIsSubmitting(true);
    const redirectTo = new URL(
      `${AUTH_CALLBACK_PATH}?${new URLSearchParams({ next: RESET_PASSWORD_PATH }).toString()}`,
      window.location.origin,
    ).toString();
    const { error: requestError } = await client.auth.resetPasswordForEmail(email.trim(), {
      redirectTo,
    });
    setIsSubmitting(false);
    if (requestError) {
      setError(COPY.failure);
      return;
    }
    setMessage(COPY.sent);
    setIsSent(true);
  }

  return (
    <>
      {!isConfigured && (
        <p
          className="mb-5 mt-0 rounded-[10px] border border-[#e1e8f1] bg-[#f5f8fc] px-3.5 py-3 text-[13px] leading-[1.6] text-[#536477]"
          role="status"
        >
          {COPY.unavailable}
        </p>
      )}
      <form
        aria-busy={isSubmitting}
        className="flex flex-col gap-[18px]"
        noValidate
        onSubmit={handleSubmit}
      >
        {error && (
          <div
            className="rounded-[10px] border border-[#f1cdcd] bg-[#fff5f5] px-3.5 py-3 text-sm leading-6 text-[#a13239]"
            role="alert"
          >
            <p className="m-0">{error}</p>
          </div>
        )}
        {message && (
          <p
            className="m-0 rounded-[10px] border border-[#e1e7ee] px-3.5 py-3 text-sm leading-[1.6] text-[#536477]"
            role="status"
          >
            {message}
          </p>
        )}
        <AuthTextField
          autoComplete="email"
          id="auth-email"
          inputMode="email"
          isDisabled={isBusy}
          label={SHARED.emailLabel}
          onChange={(value) => {
            setEmail(value);
            setError(null);
            setIsSent(false);
            setMessage(null);
          }}
          placeholder={SHARED.emailPlaceholder}
          type="email"
          value={email}
        />
        <Button className={PRIMARY_CLASSES} isDisabled={isBusy} type="submit">
          {isSubmitting ? SHARED.processing : COPY.submit}
        </Button>
      </form>
      {isSent && (
        <Link
          className="mt-3.5 flex min-h-12 w-full items-center justify-center rounded-[10px] border border-[#d7e0ea] bg-white text-sm font-semibold text-[#1769c2] transition-colors hover:border-[#a9c6e7] hover:bg-[#f2f7fd] motion-reduce:transition-none"
          href="/masuk"
        >
          {COPY.backToLogin}
        </Link>
      )}
      <Link
        className="mt-4 block py-2 text-center text-sm text-[#1769c2] hover:underline"
        href={GUEST_FALLBACK_PATH}
      >
        {SHARED.guest}
      </Link>
    </>
  );
}
