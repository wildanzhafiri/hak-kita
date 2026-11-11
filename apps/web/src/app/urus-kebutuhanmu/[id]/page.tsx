import type { Metadata } from 'next';
import { loadPublicServices } from '@/server/data';
import { ProgramDetailPage } from '../../_components/program-detail-page';
import type { ProgramPageProps } from '../../types';

export const dynamicParams = false;

export async function generateStaticParams() {
  return (await loadPublicServices()).map((p) => ({ id: p.id }));
}

export async function generateMetadata({ params }: ProgramPageProps): Promise<Metadata> {
  const { id } = await params;
  const program = (await loadPublicServices()).find((p) => p.id === id);
  return { title: program?.nama ?? 'Layanan', description: program?.ringkasan };
}

export default async function UrusKebutuhanmuDetailPage({ params }: ProgramPageProps) {
  const { id } = await params;
  return <ProgramDetailPage id={id} layanan />;
}
