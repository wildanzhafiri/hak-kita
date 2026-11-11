'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useEffect, useRef, useState, type FormEvent } from 'react';
import { Button } from '@/components/ui/button';
import { SAVED_PROGRAMS_TABLE } from '@/config/auth';
import { markSavedProgram } from '@/hooks/saved-program-store';
import { getSupabaseBrowserClient, isSupabaseConfigured } from '@/lib/supabase/client';
import { AuthPasswordField } from './auth-password-field';
import { AuthTextField } from './auth-text-field';
import {
  AUTH_CALLBACK_PATH,
  DEFAULT_AUTH_REDIRECT,
  NAME_MAX_LENGTH,
  SIGNUP_DEFAULT_REDIRECT,
} from './constants';
import { AUTH_ERROR_COPY, AUTH_FORM_COPY, AUTH_SHARED_COPY as SHARED } from './content';
import { guestDestination } from './safe-auth-path';
import { validateAuthFields } from './validate-auth-fields';
import type { AuthFieldErrors, AuthFieldValues, AuthFormProps } from './types';

const PRIMARY_CLASSES =
  'w-full min-h-[50px] rounded-[10px] !bg-[#1769c2] text-[15px] hover:!bg-[#1458a3] disabled:!bg-[#f0f3f7] disabled:!text-[#637085]';

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

export function AuthForm({
  mode,
  nextPath,
  saveProgramId,
  initialMessage,
  adminMode,
}: AuthFormProps) {
  const router = useRouter();
  const copy = AUTH_FORM_COPY[mode];
  const isSignup = mode === 'signup';
  const isConfigured = isSupabaseConfigured();
  const [fields, setFields] = useState<AuthFieldValues>({ name: '', email: '', password: '' });
  const [errors, setErrors] = useState<AuthFieldErrors>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(initialMessage);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const summaryRef = useRef<HTMLDivElement>(null);
  const isBusy = !isConfigured || isSubmitting;
  const errorMessages = [...Object.values(errors), formError].filter((error): error is string =>
    Boolean(error),
  );
  const switchParams = new URLSearchParams({
    ...(nextPath === SIGNUP_DEFAULT_REDIRECT || nextPath === DEFAULT_AUTH_REDIRECT
      ? {}
      : { next: nextPath }),
    ...(saveProgramId ? { save: saveProgramId } : {}),
  });
  const switchHref = `/${isSignup ? 'masuk' : 'daftar'}${switchParams.size > 0 ? `?${switchParams.toString()}` : ''}`;

  const errorKey = errorMessages.join('|');

  useEffect(() => {
    if (errorKey) summaryRef.current?.focus();
  }, [errorKey]);

  function change(field: keyof AuthFieldValues, value: string) {
    setFields((current) => ({ ...current, [field]: value }));
    setErrors((current) => ({ ...current, [field]: undefined }));
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const client = getSupabaseBrowserClient();
    if (!client || isSubmitting) return;
    const validation = validateAuthFields(isSignup ? 'signup' : 'login', fields);
    setErrors(validation);
    setFormError(null);
    setMessage(null);
    if (Object.keys(validation).length > 0) return;

    const email = fields.email.trim();
    setIsSubmitting(true);
    const result = isSignup
      ? await client.auth.signUp({
          email,
          password: fields.password,
          options: {
            data: { nama: fields.name.trim() },
            emailRedirectTo: new URL(
              buildRedirectPath(nextPath, saveProgramId),
              window.location.origin,
            ).toString(),
          },
        })
      : await client.auth.signInWithPassword({ email, password: fields.password });

    if (result.error) {
      setFormError(authErrorMessage(result.error.message));
      setFields((current) => ({ ...current, password: '' }));
      setIsSubmitting(false);
      return;
    }

    if (isSignup && !result.data.session) {
      setMessage(SHARED.confirmEmail);
      setFields((current) => ({ ...current, password: '' }));
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
        setFormError(AUTH_ERROR_COPY.saveFailed);
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
    if (!client || isSubmitting) return;

    setIsSubmitting(true);
    setFormError(null);
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
        setFormError(AUTH_ERROR_COPY.oauth);
        setIsSubmitting(false);
      }
    } catch {
      setFormError(AUTH_ERROR_COPY.oauth);
      setIsSubmitting(false);
    }
  }

  return (
    <>
      {!adminMode && (
        <>
          <Button
            className="w-full min-h-[50px] gap-3 rounded-[10px] border-[#d7e0ea] !bg-white px-[18px] py-3 text-[15px] font-medium !text-[#1b304c] hover:!bg-[#f7f9fc] disabled:!bg-[#f0f3f7] disabled:!text-[#637085]"
            isDisabled={isBusy}
            onPress={handleGoogleSignIn}
            tone="secondary"
            type="button"
          >
            <Image alt="" height={20} src="/google-g-logo.png" width={20} />
            {isSubmitting ? SHARED.googleConnecting : SHARED.google}
          </Button>
          <div className="my-5 flex items-center gap-3.5 text-[13px] text-[#687385]">
            <span className="h-px flex-1 bg-[#e1e7ee]" />
            <span>{copy.emailDivider}</span>
            <span className="h-px flex-1 bg-[#e1e7ee]" />
          </div>
        </>
      )}
      {!isConfigured && (
        <p
          className="mb-5 mt-0 rounded-[10px] border border-[#e1e8f1] bg-[#f5f8fc] px-3.5 py-3 text-[13px] leading-[1.6] text-[#536477]"
          id="auth-availability"
          role="status"
        >
          {SHARED.unavailable}
        </p>
      )}
      <form
        aria-busy={isSubmitting}
        className="flex flex-col gap-[18px]"
        noValidate
        onSubmit={handleSubmit}
      >
        {errorMessages.length > 0 && (
          <div
            className="rounded-[10px] border border-[#f1cdcd] bg-[#fff5f5] px-3.5 py-3 text-sm leading-6 text-[#a13239] outline-none"
            ref={summaryRef}
            role="alert"
            tabIndex={-1}
          >
            {errorMessages.map((error) => (
              <p className="m-0" key={error}>
                {error}
              </p>
            ))}
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
        {isSignup && (
          <AuthTextField
            autoComplete="nickname"
            error={errors.name}
            id="auth-name"
            isDisabled={isBusy}
            label={SHARED.nameLabel}
            maxLength={NAME_MAX_LENGTH}
            onChange={(value) => change('name', value)}
            placeholder={SHARED.namePlaceholder}
            value={fields.name}
          />
        )}
        <AuthTextField
          autoComplete="email"
          error={errors.email}
          id="auth-email"
          inputMode="email"
          isDisabled={isBusy}
          label={SHARED.emailLabel}
          onChange={(value) => change('email', value)}
          placeholder={SHARED.emailPlaceholder}
          type="email"
          value={fields.email}
        />
        <AuthPasswordField
          autoComplete={isSignup ? 'new-password' : 'current-password'}
          error={errors.password}
          id="auth-password"
          isDisabled={isBusy}
          label={SHARED.passwordLabel}
          onChange={(value) => change('password', value)}
          placeholder={copy.passwordPlaceholder}
          value={fields.password}
        />
        {!isSignup && !adminMode && (
          <Link
            className="-mt-[7px] self-end text-[13px] text-[#1769c2] hover:underline"
            href="/lupa-kata-sandi"
          >
            {SHARED.forgot}
          </Link>
        )}
        <Button className={PRIMARY_CLASSES} isDisabled={isBusy} type="submit">
          {isSubmitting ? SHARED.processing : copy.submit}
        </Button>
      </form>
      {!adminMode && (
        <>
          <p className="mb-4 mt-[22px] text-center text-sm text-[#687385]">
            {copy.switchLabel}{' '}
            <Link className="font-semibold text-[#1769c2] hover:underline" href={switchHref}>
              {copy.switchAction}
            </Link>
          </p>
          <Link
            className="block py-2 text-center text-sm text-[#1769c2] hover:underline"
            href={guestDestination(nextPath)}
          >
            {SHARED.guest}
          </Link>
        </>
      )}
    </>
  );
}
