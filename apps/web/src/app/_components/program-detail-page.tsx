import { notFound } from 'next/navigation';
import { buildWilayahIndex, isLayanan, todayWIB, wilayahName } from '@hakkita/domain';
import { PageShell } from '@/components/layout/page-shell';
import { ProgramDetail } from '@/features/program/program-detail';
import { loadPrograms, loadWilayahFile } from '@/server/data';
import type { ProgramDetailPageProps } from './types';

export async function ProgramDetailPage({ id, layanan }: ProgramDetailPageProps) {
  const [programs, wilayahFile] = await Promise.all([loadPrograms(), loadWilayahFile()]);
  const program = programs.find((p) => p.id === id && isLayanan(p) === layanan);
  if (!program) notFound();
  const index = buildWilayahIndex(wilayahFile.wilayah);

  return (
    <PageShell
      breadcrumbs={[
        layanan
          ? { label: 'Urus Kebutuhanmu', href: '/urus-kebutuhanmu' }
          : { label: 'Kenali Hakmu', href: '/kenali-hakmu' },
        { label: program.nama },
      ]}
      compact
      title={program.nama}
      description={program.ringkasan}
    >
      <ProgramDetail
        program={program}
        namaCakupan={wilayahName(index, program.cakupan.kode)}
        builtOn={todayWIB()}
      />
    </PageShell>
  );
}
