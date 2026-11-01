import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { isLayanan, todayWIB } from '@hakkita/domain';
import { PageShell } from '@/components/layout/page-shell';
import { BerkasSheet } from '@/features/berkas/berkas-sheet';
import { loadPrograms } from '@/server/data';
import type { ProgramPageProps } from '../../../types';

export const dynamicParams = false;

export async function generateStaticParams() {
  const programs = await loadPrograms();
  return programs.filter((p) => !isLayanan(p) && p.berkas).map((p) => ({ id: p.id }));
}

export async function generateMetadata({ params }: ProgramPageProps): Promise<Metadata> {
  const { id } = await params;
  const program = (await loadPrograms()).find((p) => p.id === id);
  return {
    title: program ? `Berkas siap bawa: ${program.nama}` : 'Berkas siap bawa',
    description: 'Siapkan dokumen dan data yang kamu perlukan sebelum mengajukan.',
  };
}

export default async function BerkasPage({ params }: ProgramPageProps) {
  const { id } = await params;
  const program = (await loadPrograms()).find((p) => p.id === id && !isLayanan(p));
  if (!program?.berkas) notFound();

  return (
    <PageShell
      breadcrumbs={[
        { label: 'Kenali Hakmu', href: '/program' },
        { label: program.nama, href: `/program/${program.id}` },
        { label: 'Berkas siap bawa' },
      ]}
      eyebrow="BERKAS SIAP BAWA"
      title={`Siapkan berkas ${program.nama}.`}
      description="Jawab beberapa pertanyaan, lalu lihat dokumen yang perlu kamu siapkan sebelum mengajukan."
    >
      <BerkasSheet program={program} berkas={program.berkas} builtOn={todayWIB()} />
    </PageShell>
  );
}
