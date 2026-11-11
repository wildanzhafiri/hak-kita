import type { Metadata } from 'next';
import { todayWIB } from '@hakkita/domain';
import type { PencarianPageProps } from '@/app/types';
import { PageShell } from '@/components/layout/page-shell';
import { ProgramList } from '@/features/program/program-list';
import { loadPublishedInformation, loadWilayahFile } from '@/server/data';

const DESCRIPTION = 'Cari program dan layanan publik dalam satu tempat.';

export const metadata: Metadata = { title: 'Pencarian', description: DESCRIPTION };

export default async function PencarianPage({ searchParams }: PencarianPageProps) {
  const [params, items, wilayahFile] = await Promise.all([
    searchParams,
    loadPublishedInformation(),
    loadWilayahFile(),
  ]);
  const query = (Array.isArray(params.q) ? params.q[0] : params.q) ?? '';

  return (
    <PageShell breadcrumbs={[{ label: 'Pencarian' }]} title="Pencarian" description={DESCRIPTION}>
      <ProgramList
        key={query}
        initialQuery={query}
        placeholder="Cari program atau layanan publik..."
        programs={items}
        today={todayWIB()}
        wilayah={wilayahFile.wilayah}
      />
    </PageShell>
  );
}
