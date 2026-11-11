import type { Metadata } from 'next';
import { AdminShell } from '@/components/layout/admin-shell';
import { AdminAccess } from '@/features/admin/admin-access';
import { AUTH_ERROR_COPY } from '@/features/auth/content';
import { RADAR_HISTORY_COPY } from '@/features/admin/content';
import { RadarHistory } from '@/features/admin/radar-history';
import { getRadarAccessState } from '@/server/admin-access';
import { loadReviewedRadarCandidates } from '@/server/radar-review';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Riwayat Aktivitas | HAKKITA',
  description: 'Tinjau riwayat keputusan atas temuan Radar.',
  robots: { index: false, follow: false },
};

export default async function AdminHistoryPage() {
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

  const candidates = await loadReviewedRadarCandidates();

  return (
    <AdminShell activeSection="history" adminEmail={access.email}>
      <div className="mx-auto max-w-[1440px]">
        <header className="mb-6 max-w-[800px]">
          <h1 className="text-[28px] font-semibold leading-tight tracking-[-0.025em] text-[#253044] sm:text-[30px]">
            {RADAR_HISTORY_COPY.title}
          </h1>
          <p className="mt-2 text-sm leading-6 text-[#64748b]">{RADAR_HISTORY_COPY.description}</p>
        </header>
        <RadarHistory candidates={candidates} />
      </div>
    </AdminShell>
  );
}
