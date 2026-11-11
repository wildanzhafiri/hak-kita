import { redirect } from 'next/navigation';
import { safeAuthPath } from './safe-auth-path';
import { AuthForm } from './auth-form';
import { AuthLayout } from './auth-layout';
import { SIGNUP_DEFAULT_REDIRECT } from './constants';
import { AUTH_ERROR_COPY, AUTH_FORM_COPY } from './content';
import type { AuthPageProps } from './types';

export async function AuthPage({ mode, searchParams }: AuthPageProps) {
  const params = await searchParams;
  const nextPath =
    mode === 'signup' && !params.next ? SIGNUP_DEFAULT_REDIRECT : safeAuthPath(params.next);
  if (params.admin === '1' || nextPath.startsWith('/admin')) redirect('/admin/validasi');
  const saveProgramId =
    params.save && /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(params.save) ? params.save : null;
  const initialMessage =
    params.error === 'oauth'
      ? AUTH_ERROR_COPY.oauth
      : params.error === 'callback'
        ? AUTH_ERROR_COPY.callback
        : null;
  const copy = AUTH_FORM_COPY[mode];

  return (
    <AuthLayout subtitle={copy.subtitle} title={copy.title}>
      <AuthForm
        adminMode={false}
        initialMessage={initialMessage}
        mode={mode}
        nextPath={nextPath}
        saveProgramId={saveProgramId}
      />
    </AuthLayout>
  );
}
