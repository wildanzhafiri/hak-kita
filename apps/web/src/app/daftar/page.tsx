import type { Metadata } from 'next';
import { AuthPage } from '@/features/auth/auth-page';
import type { AuthPageProps } from '@/features/auth/types';

export const metadata: Metadata = { title: 'Daftar' };

export default function DaftarPage({ searchParams }: Pick<AuthPageProps, 'searchParams'>) {
  return <AuthPage mode="signup" searchParams={searchParams} />;
}
