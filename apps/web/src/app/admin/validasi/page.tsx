import type { Metadata } from 'next';
import { AdminShell } from '@/components/layout/admin-shell';
import { AdminAccess } from '@/features/admin/admin-access';
import { AUTH_ERROR_COPY } from '@/features/auth/content';
import { getRadarAccessState } from '@/server/admin-access';
import { loadPrograms } from '@/server/data';
import { loadPendingDiscoveredPrograms } from '@/server/radar-program-discovery';
import { loadPendingRadarCandidates } from '@/server/radar-review';
import { loadRadarSettings } from '@/server/radar-settings';
import { VALIDATION_COPY } from './content';
import { RadarControls } from './radar-controls';
import { ValidationMetrics } from './validation-metrics';
import { ValidationQueue } from './validation-queue';
import type { ValidationItem } from './types';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Validasi Informasi | HAKKITA',
  description: 'Periksa informasi yang ditemukan sebelum ditampilkan di HAKKITA.',
  robots: { index: false, follow: false },
};

export default async function ValidationPage() {
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
  const [newsCandidates, programCandidates, settings, programs] = await Promise.all([
    loadPendingRadarCandidates(),
    loadPendingDiscoveredPrograms(),
    loadRadarSettings(),
    loadPrograms(),
  ]);
  const kindById = new Map(programs.map((program) => [program.id, program.jenis]));
  const items: ValidationItem[] = [
    ...programCandidates.map((candidate) => ({
      id: candidate.id,
      finding: 'new' as const,
      kind: candidate.record.program.jenis,
      name: candidate.record.program.nama,
      summary: candidate.record.program.ringkasan,
      detectedAt: candidate.detected_at,
    })),
    ...newsCandidates.map((candidate) => ({
      id: candidate.id,
      finding: 'update' as const,
      kind: kindById.get(candidate.program_id) ?? ('program' as const),
      name: candidate.program_name,
      summary: candidate.draft_summary ?? candidate.draft_title ?? candidate.evidence_quote ?? '',
      detectedAt: candidate.detected_at,
    })),
  ].sort((left, right) => right.detectedAt.localeCompare(left.detectedAt));

  return (
    <AdminShell activeSection="validation" adminEmail={access.email}>
      <div className="mx-auto max-w-[1440px]">
        <header className="mb-6 max-w-[800px]">
          <h1 className="text-[28px] font-semibold leading-tight tracking-[-0.025em] text-[#253044] sm:text-[30px]">
            {VALIDATION_COPY.title}
          </h1>
          <p className="mt-2 text-sm leading-6 text-[#64748b]">{VALIDATION_COPY.description}</p>
        </header>
        <ValidationMetrics items={items} />
        <RadarControls initialSettings={settings} />
        <ValidationQueue items={items} />
      </div>
    </AdminShell>
  );
}
