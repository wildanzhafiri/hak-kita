import type { Metadata } from 'next';
import { AdminShell } from '@/components/layout/admin-shell';
import { AdminAccess } from '@/features/admin/admin-access';
import { AUTH_ERROR_COPY } from '@/features/auth/content';
import { loadPendingRadarCandidates } from '@/server/radar-review';
import { loadPendingDiscoveredPrograms } from '@/server/radar-program-discovery';
import { getRadarAccessState } from '@/server/admin-access';
import { loadRadarSettings } from '@/server/radar-settings';
import { RADAR_ADMIN_COPY } from './content';
import { RadarReview } from './radar-review';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Panel Admin | HAKKITA',
  description: 'Tinjau dan kelola informasi program HAKKITA.',
  robots: { index: false, follow: false },
};

export default async function RadarAdminPage() {
  const access = await getRadarAccessState();
  if (access.status !== 'authorized') {
    const initialMessage =
      access.status === 'forbidden'
        ? AUTH_ERROR_COPY.admin
        : access.status === 'unconfigured'
          ? AUTH_ERROR_COPY.adminSetup
          : null;
    return <AdminAccess initialMessage={initialMessage} />;
  }
  const [candidates, programCandidates, settings] = await Promise.all([
    loadPendingRadarCandidates(),
    loadPendingDiscoveredPrograms(),
    loadRadarSettings(),
  ]);

  return (
    <AdminShell activeSection="radar" adminEmail={access.email}>
      <div className="mx-auto max-w-[1440px]">
        <header className="mb-6 max-w-[800px]">
          <h1 className="text-[28px] font-semibold leading-tight tracking-[-0.025em] text-[#253044] sm:text-[30px]">
            {RADAR_ADMIN_COPY.title}
          </h1>
          <p className="mt-2 text-sm leading-6 text-[#64748b]">{RADAR_ADMIN_COPY.description}</p>
        </header>
        <RadarReview
          initialCandidates={candidates}
          initialProgramCandidates={programCandidates}
          initialSettings={settings}
        />
      </div>
    </AdminShell>
  );
}
