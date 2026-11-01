import type { Metadata } from 'next';
import { PageShell } from '@/components/layout/page-shell';
import { loadApbdBudgetSnapshot } from '@/server/budget';
import { APBN_METRICS, ANGGARAN_CONTENT } from './content';
import { BudgetOverview } from './budget-overview';

export const metadata: Metadata = {
  title: 'Telusuri Anggaran',
  description: ANGGARAN_CONTENT.description,
};

export const revalidate = 3600;

export default async function AnggaranPage() {
  const snapshot = await loadApbdBudgetSnapshot(2026);

  return (
    <PageShell
      breadcrumbs={ANGGARAN_CONTENT.breadcrumbs}
      eyebrow={ANGGARAN_CONTENT.eyebrow}
      title={ANGGARAN_CONTENT.title}
      description={ANGGARAN_CONTENT.description}
    >
      <BudgetOverview
        metrics={APBN_METRICS}
        year={snapshot.year}
        period={snapshot.period}
        dataReceived={snapshot.dataReceived}
        composition={snapshot.categories}
      />
    </PageShell>
  );
}
