import { redirect } from 'next/navigation';
import { PageShell } from '@/components/layout/page-shell';
import { safeAuthPath } from './safe-auth-path';
import { AuthForm } from './auth-form';
import { AUTH_ERROR_COPY } from './content';
import type { AuthPageProps } from './types';

export async function AuthPage({ mode, searchParams }: AuthPageProps) {
  const params = await searchParams;
  const nextPath = safeAuthPath(params.next);
  if (params.admin === '1' || nextPath.startsWith('/admin')) redirect('/admin/radar');
  const saveProgramId =
    params.save && /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(params.save) ? params.save : null;
  const initialMessage =
    params.error === 'oauth'
      ? AUTH_ERROR_COPY.oauth
      : params.error === 'callback'
        ? AUTH_ERROR_COPY.callback
        : null;
  const isLogin = mode === 'login';
  const title = isLogin ? 'Masuk ke HAKKITA' : 'Buat akun HAKKITA';
  const description = 'Simpan program pilihanmu dan lanjutkan rencanamu dari satu tempat.';

  return (
    <PageShell
      breadcrumbs={[{ label: isLogin ? 'Masuk' : 'Daftar' }]}
      compact
      description={description}
      eyebrow="AKUN HAKKITA"
      title={title}
    >
      <AuthForm
        initialMessage={initialMessage}
        mode={mode}
        nextPath={nextPath}
        saveProgramId={saveProgramId}
        adminMode={false}
      />
    </PageShell>
  );
}
