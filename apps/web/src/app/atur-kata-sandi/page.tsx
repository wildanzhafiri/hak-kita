import type { Metadata } from 'next';
import { AuthLayout } from '@/features/auth/auth-layout';
import { AUTH_RESET_COPY } from '@/features/auth/content';
import { ResetPasswordForm } from '@/features/auth/reset-password-form';

export const metadata: Metadata = {
  title: 'Atur kata sandi baru',
  robots: { index: false, follow: false },
};

export default function AturKataSandiPage() {
  return (
    <AuthLayout hidePrivacy subtitle={AUTH_RESET_COPY.subtitle} title={AUTH_RESET_COPY.title}>
      <ResetPasswordForm />
    </AuthLayout>
  );
}
