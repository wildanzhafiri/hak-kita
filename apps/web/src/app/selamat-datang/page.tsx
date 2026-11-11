import type { Metadata } from 'next';
import { PageShell } from '@/components/layout/page-shell';
import { WELCOME_COPY } from '@/features/profil/content';
import { WelcomePage } from '@/features/profil/welcome-page';

export const metadata: Metadata = {
  title: 'Selamat datang',
  robots: { index: false, follow: false },
};

export default function SelamatDatangPage() {
  return (
    <PageShell
      breadcrumbs={[{ label: WELCOME_COPY.breadcrumb }]}
      description={WELCOME_COPY.description}
      narrow
      title={WELCOME_COPY.title}
    >
      <WelcomePage />
    </PageShell>
  );
}
