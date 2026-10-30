import type { Metadata } from 'next';
import { isLayanan } from '@hakkita/domain';
import { loadPrograms } from '@/server/data';
import { ProgramDetailPage } from '../../_components/program-detail-page';
import type { ProgramPageProps } from '../../types';

export const dynamicParams = false;

export async function generateStaticParams() {
  const programs = await loadPrograms();
  return programs.filter((p) => !isLayanan(p)).map((p) => ({ id: p.id }));
}

export async function generateMetadata({ params }: ProgramPageProps): Promise<Metadata> {
  const { id } = await params;
  const program = (await loadPrograms()).find((p) => p.id === id);
  return { title: program?.nama ?? 'Program', description: program?.ringkasan };
}

export default async function KenaliHakmuDetailPage({ params }: ProgramPageProps) {
  const { id } = await params;
  return <ProgramDetailPage id={id} layanan={false} />;
}
