import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { AdminShell } from '@/components/layout/admin-shell';
import { AdminAccess } from '@/features/admin/admin-access';
import { AUTH_ERROR_COPY } from '@/features/auth/content';
import { ProgramDetail } from '@/features/admin/program-detail';
import { getRadarAccessState } from '@/server/admin-access';
import { isProgramManagementConfigured } from '@/server/admin-programs';
import { buildWilayahIndex, wilayahName } from '@hakkita/domain';
import { loadAllInformation, loadWilayahFile } from '@/server/data';
import { PublishedInfo } from './published-info';
import type { AdminInformationDetailPageProps } from './types';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Detail Informasi | HAKKITA',
  description: 'Periksa rincian dan sumber resmi informasi HAKKITA.',
  robots: { index: false, follow: false },
};

export default async function AdminInformationDetailPage({
  params,
}: AdminInformationDetailPageProps) {
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

  const [{ id }, programs, wilayahFile] = await Promise.all([
    params,
    loadAllInformation(),
    loadWilayahFile(),
  ]);
  const program = programs.find((record) => record.id === id);
  if (!program) notFound();
  const regionName = wilayahName(buildWilayahIndex(wilayahFile.wilayah), program.cakupan.kode);

  return (
    <AdminShell activeSection="programs" adminEmail={access.email}>
      <ProgramDetail canManage={isProgramManagementConfigured()} program={program}>
        <PublishedInfo program={program} regionName={regionName} />
      </ProgramDetail>
    </AdminShell>
  );
}
