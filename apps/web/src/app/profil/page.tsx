import type { Metadata } from 'next';
import { PageShell } from '@/components/layout/page-shell';
import { PROFILE_PAGE_COPY } from '@/features/profil/content';
import { ProfilePage } from '@/features/profil/profile-page';
import { loadWilayahFile } from '@/server/data';
import type { ProfilePageProps } from './types';

export const metadata: Metadata = {
  title: PROFILE_PAGE_COPY.title,
  robots: { index: false, follow: false },
};

export default async function ProfilRoute({ searchParams }: ProfilePageProps) {
  const [wilayahFile, params] = await Promise.all([loadWilayahFile(), searchParams]);

  return (
    <PageShell
      breadcrumbs={[{ label: PROFILE_PAGE_COPY.title }]}
      description={PROFILE_PAGE_COPY.description}
      narrow
      title={PROFILE_PAGE_COPY.title}
    >
      <ProfilePage isSaved={params.disimpan === '1'} wilayah={wilayahFile.wilayah} />
    </PageShell>
  );
}
