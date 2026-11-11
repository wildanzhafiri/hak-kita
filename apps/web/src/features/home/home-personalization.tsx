import Link from 'next/link';
import { HOME_PERSONALIZATION_COPY as COPY } from '@/features/profil/content';
import type { HomePersonalizationProps } from './types';

const LINK_CLASSES = 'font-semibold text-[#196dcc] hover:underline';

export function HomePersonalization({ mode }: HomePersonalizationProps) {
  if (mode === 'ready') {
    return (
      <>
        {COPY.ready}{' '}
        <Link className={LINK_CLASSES} href="/kenali-hakmu/rekomendasi">
          {COPY.readyAction}
        </Link>
      </>
    );
  }

  return (
    <>
      {COPY.guest}{' '}
      {mode === 'guest' ? (
        <Link className={LINK_CLASSES} href="/daftar?next=%2Fprofil%2Fedit">
          {COPY.guestAction}
        </Link>
      ) : (
        <Link className={LINK_CLASSES} href="/profil/edit">
          {COPY.incompleteAction}
        </Link>
      )}
    </>
  );
}
