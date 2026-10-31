import type { Metadata } from 'next';
import { todayWIB } from '@hakkita/domain';
import { PageShell } from '@/components/layout/page-shell';
import { ConditionChecker } from '@/features/kondisi/condition-checker';
import { loadPrograms, loadWilayahFile } from '@/server/data';

export const metadata: Metadata = {
  title: 'Periksa Kondisimu',
  description:
    'Temukan program yang berpotensi sesuai dari jawaban awalmu dan periksa syarat resminya.',
};

export default async function PeriksaKondisimuPage() {
  const [programs, wilayahFile] = await Promise.all([loadPrograms(), loadWilayahFile()]);
  return (
    <PageShell
      breadcrumbs={[{ label: 'Periksa Kondisimu' }]}
      eyebrow="PERIKSA KONDISIMU"
      title="Cari tahu program yang perlu kamu periksa."
      description="Jawab pertanyaan singkat untuk menemukan program yang berpotensi sesuai. Keputusan penerimaan tetap ada pada penyelenggara."
    >
      <ConditionChecker programs={programs} wilayah={wilayahFile.wilayah} builtOn={todayWIB()} />
    </PageShell>
  );
}
