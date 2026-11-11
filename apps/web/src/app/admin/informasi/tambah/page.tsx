import type { Metadata } from 'next';
import { AdminShell } from '@/components/layout/admin-shell';
import { AdminAccess } from '@/features/admin/admin-access';
import { PROGRAM_ADMIN_COPY, PROGRAM_DETAIL_COPY } from '@/features/admin/content';
import { ProgramEditor } from '@/features/admin/program-editor';
import { AUTH_ERROR_COPY } from '@/features/auth/content';
import { getRadarAccessState } from '@/server/admin-access';
import { isProgramManagementConfigured } from '@/server/admin-programs';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Tambah Informasi | HAKKITA',
  description: 'Tambahkan informasi program atau layanan ke HAKKITA.',
  robots: { index: false, follow: false },
};

export default async function CreateAdminInformationPage() {
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

  const canManage = isProgramManagementConfigured();

  return (
    <AdminShell activeSection="programs" adminEmail={access.email}>
      <section className="mx-auto max-w-[1080px] rounded-xl border border-[#e1e9f2] bg-white p-5 sm:p-7">
        <div className="mb-6">
          <h1 className="text-2xl font-semibold text-[#253044]">
            {PROGRAM_DETAIL_COPY.createTitle}
          </h1>
          <p className="mt-2 text-sm leading-6 text-[#64748b]">
            {canManage
              ? PROGRAM_DETAIL_COPY.newHeadingDescription
              : PROGRAM_ADMIN_COPY.storageUnavailable}
          </p>
        </div>
        {canManage ? <ProgramEditor /> : null}
      </section>
    </AdminShell>
  );
}
