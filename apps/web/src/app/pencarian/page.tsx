import type { Metadata } from 'next';
import { Suspense } from 'react';
import { PageShell } from '@/components/layout/page-shell';
import { SearchResults } from '@/features/program/search-results';
import { loadPublishedInformation, loadWilayahFile } from '@/server/data';
import { todayWIB } from '@hakkita/domain';

const DESCRIPTION = 'Cari informasi dari seluruh program dan layanan HAKKITA.';

export const metadata: Metadata = { title: 'Pencarian', description: DESCRIPTION };

export default async function PencarianPage() {
  const [programs, wilayahFile] = await Promise.all([
    loadPublishedInformation(),
    loadWilayahFile(),
  ]);
  return (
    <PageShell
      breadcrumbs={[{ label: 'Pencarian' }]}
      eyebrow="HAK KITA, UNTUK KITA"
      title="Satu pencarian, banyak jalan ke depan."
      description={DESCRIPTION}
    >
      <Suspense fallback={<p role="status">Menyiapkan pencarian…</p>}>
        <SearchResults programs={programs} wilayah={wilayahFile.wilayah} today={todayWIB()} />
      </Suspense>
    </PageShell>
  );
}
