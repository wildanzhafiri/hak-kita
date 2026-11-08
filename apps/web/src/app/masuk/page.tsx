import type { Metadata } from 'next';
import { AuthPage } from '@/features/auth/auth-page';
import type { AuthPageProps } from '@/features/auth/types';

export const metadata: Metadata = { title: 'Masuk' };

export default function MasukPage({ searchParams }: Pick<AuthPageProps, 'searchParams'>) {
  return <AuthPage mode="login" searchParams={searchParams} />;
}
