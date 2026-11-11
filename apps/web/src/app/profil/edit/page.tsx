import type { Metadata } from 'next';
import { PageShell } from '@/components/layout/page-shell';
import { PROFILE_EDITOR_COPY } from '@/features/profil/content';
import { ProfileEditor } from '@/features/profil/profile-editor';
import { loadWilayahFile } from '@/server/data';
import type { ProfileEditPageProps } from '../types';

export const metadata: Metadata = {
  title: PROFILE_EDITOR_COPY.title,
  robots: { index: false, follow: false },
};

export default async function ProfilEditRoute({ searchParams }: ProfileEditPageProps) {
  const [wilayahFile, params] = await Promise.all([loadWilayahFile(), searchParams]);

  return (
    <PageShell
      breadcrumbs={[
        { label: PROFILE_EDITOR_COPY.breadcrumbProfile, href: '/profil' },
        { label: PROFILE_EDITOR_COPY.title },
      ]}
      description={PROFILE_EDITOR_COPY.description}
      narrow
      title={PROFILE_EDITOR_COPY.title}
    >
      <ProfileEditor fromProfile={params.dari === 'profil'} wilayah={wilayahFile.wilayah} />
    </PageShell>
  );
}
