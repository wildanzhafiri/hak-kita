'use client';

import Link from 'next/link';
import { useState, type FormEvent } from 'react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/use-auth';
import { getSupabaseBrowserClient } from '@/lib/supabase/client';
import { AuthPasswordField } from './auth-password-field';
import { DEFAULT_AUTH_REDIRECT, MIN_PASSWORD_LENGTH } from './constants';
import {
  AUTH_FIELD_ERROR_COPY,
  AUTH_RESET_COPY as COPY,
  AUTH_SHARED_COPY as SHARED,
} from './content';

const PRIMARY_CLASSES =
  'w-full min-h-[50px] rounded-[10px] !bg-[#1769c2] text-[15px] hover:!bg-[#1458a3] disabled:!bg-[#f0f3f7] disabled:!text-[#637085]';

export function ResetPasswordForm() {
  const { user, isReady } = useAuth();
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDone, setIsDone] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const client = getSupabaseBrowserClient();
    if (!client || isSubmitting) return;
    const validationError = !password
      ? AUTH_FIELD_ERROR_COPY.passwordRequired
      : password.length < MIN_PASSWORD_LENGTH
        ? AUTH_FIELD_ERROR_COPY.passwordTooShort
        : null;
    if (validationError) {
      setError(validationError);
      return;
    }
    setError(null);
    setIsSubmitting(true);
    const { error: updateError } = await client.auth.updateUser({ password });
    setIsSubmitting(false);
    setPassword('');
    if (updateError) {
      setError(COPY.failure);
      return;
    }
    setIsDone(true);
  }

  if (!isReady) return null;

  if (!user) {
    return (
      <>
        <p
          className="m-0 rounded-[10px] border border-[#f1cdcd] bg-[#fff5f5] px-3.5 py-3 text-sm leading-6 text-[#a13239]"
          role="alert"
        >
          {COPY.invalidLink}
        </p>
        <Link
          className="mt-3.5 flex min-h-12 w-full items-center justify-center rounded-[10px] border border-[#d7e0ea] bg-white text-sm font-semibold text-[#1769c2] hover:bg-[#f2f7fd]"
          href="/lupa-kata-sandi"
        >
          {COPY.requestNew}
        </Link>
      </>
    );
  }

  if (isDone) {
    return (
      <>
        <p
          className="m-0 rounded-[10px] border border-[#e1e7ee] px-3.5 py-3 text-sm leading-[1.6] text-[#536477]"
          role="status"
        >
          {COPY.done}
        </p>
        <Link
          className="mt-3.5 flex min-h-12 w-full items-center justify-center rounded-[10px] bg-[#1769c2] text-sm font-semibold text-white hover:bg-[#1458a3]"
          href={DEFAULT_AUTH_REDIRECT}
        >
          {COPY.continue}
        </Link>
      </>
    );
  }

  return (
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
      <AuthPasswordField
        autoComplete="new-password"
        id="auth-new-password"
        isDisabled={isSubmitting}
        label={COPY.label}
        onChange={(value) => {
          setPassword(value);
          setError(null);
        }}
        placeholder={COPY.placeholder}
        value={password}
      />
      <Button className={PRIMARY_CLASSES} isDisabled={isSubmitting} type="submit">
        {isSubmitting ? SHARED.processing : COPY.submit}
      </Button>
    </form>
  );
}
