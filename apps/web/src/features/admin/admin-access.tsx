import { AuthForm } from '@/features/auth/auth-form';
import type { AdminAccessProps } from './types';

export function AdminAccess({ initialMessage }: AdminAccessProps) {
  return (
    <main className="grid min-h-dvh place-items-center bg-[#f5f8fc] px-4 py-10" id="admin-main">
      <AuthForm
        adminMode
        initialMessage={initialMessage}
        mode="login"
        nextPath="/admin/radar"
        saveProgramId={null}
      />
    </main>
  );
}
