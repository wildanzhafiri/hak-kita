import type { Metadata } from 'next';
import { AuthLayout } from '@/features/auth/auth-layout';
import { AUTH_RECOVERY_COPY } from '@/features/auth/content';
import { RecoveryForm } from '@/features/auth/recovery-form';

export const metadata: Metadata = { title: 'Lupa kata sandi' };

export default function LupaKataSandiPage() {
  return (
    <AuthLayout subtitle={AUTH_RECOVERY_COPY.subtitle} title={AUTH_RECOVERY_COPY.title}>
      <RecoveryForm />
    </AuthLayout>
  );
}
