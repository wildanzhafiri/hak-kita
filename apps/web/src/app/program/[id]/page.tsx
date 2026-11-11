import { redirect } from 'next/navigation';
import type { ProgramPageProps } from '../../types';
import { loadPrograms } from '@/server/data';
import { isLayanan } from '@hakkita/domain';

export async function generateStaticParams() {
  const programs = await loadPrograms();
  return programs.filter((program) => !isLayanan(program)).map((program) => ({ id: program.id }));
}

export default async function LegacyProgramDetailPage({ params }: ProgramPageProps) {
  const { id } = await params;
  redirect(`/kenali-hakmu/${id}`);
}

export const dynamicParams = false;
