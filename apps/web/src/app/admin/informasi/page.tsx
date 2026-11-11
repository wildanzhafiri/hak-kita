import type { Metadata } from 'next';
import { AdminShell } from '@/components/layout/admin-shell';
import { AdminAccess } from '@/features/admin/admin-access';
import { AUTH_ERROR_COPY } from '@/features/auth/content';
import { PROGRAM_ADMIN_COPY } from '@/features/admin/content';
import { ProgramList } from '@/features/admin/program-list';
import { isProgramManagementConfigured } from '@/server/admin-programs';
import { getRadarAccessState } from '@/server/admin-access';
import { loadAllInformation } from '@/server/data';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Kelola Informasi | HAKKITA',
  description: 'Tinjau informasi program dan layanan HAKKITA.',
  robots: { index: false, follow: false },
};

export default async function AdminInformationPage() {
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

  const programs = await loadAllInformation();

  return (
    <AdminShell activeSection="programs" adminEmail={access.email}>
      <div className="mx-auto max-w-[1440px]">
        <header className="mb-6 max-w-[800px]">
          <h1 className="text-[28px] font-semibold leading-tight tracking-[-0.025em] text-[#253044] sm:text-[30px]">
            {PROGRAM_ADMIN_COPY.title}
          </h1>
          <p className="mt-2 text-sm leading-6 text-[#64748b]">{PROGRAM_ADMIN_COPY.description}</p>
        </header>
        <ProgramList canManage={isProgramManagementConfigured()} programs={programs} />
      </div>
    </AdminShell>
  );
}
