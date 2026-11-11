import { AuthForm } from '@/features/auth/auth-form';
import { AuthLayout } from '@/features/auth/auth-layout';
import { ADMIN_AUTH_COPY } from '@/features/auth/content';
import type { AdminAccessProps } from './types';

export function AdminAccess({ initialMessage }: AdminAccessProps) {
  return (
    <main className="grid min-h-dvh place-items-center bg-white px-4 py-10" id="admin-main">
      <AuthLayout hidePrivacy subtitle={ADMIN_AUTH_COPY.description} title={ADMIN_AUTH_COPY.title}>
        <AuthForm
          adminMode
          initialMessage={initialMessage}
          mode="login"
          nextPath="/admin/validasi"
          saveProgramId={null}
        />
      </AuthLayout>
    </main>
  );
}
