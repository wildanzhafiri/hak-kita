'use client';

import Link from 'next/link';
import { useAuth } from '@/hooks/use-auth';
import { SHEET_ACTION_CLASSES } from './constants';
import type { AuthNavActionProps } from './types';

export function AuthNavAction({
  currentPath,
  variant = 'inline',
  accountMenu,
}: AuthNavActionProps) {
  const { user } = useAuth();

  if (!user) {
    const search = new URLSearchParams({ next: currentPath });
    return (
      <Link
        className={variant === 'sheet' ? SHEET_ACTION_CLASSES.primary : 'nav-login'}
        href={`/masuk?${search.toString()}`}
      >
        Masuk
      </Link>
    );
  }

  return variant === 'inline' ? (accountMenu ?? null) : null;
}
