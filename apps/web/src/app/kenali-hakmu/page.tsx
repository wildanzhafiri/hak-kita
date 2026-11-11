import type { Metadata } from 'next';
import type { KenaliHakmuPageProps } from '@/app/types';
import { ProgramCatalogPage } from '../_components/program-catalog-page';
import { PROGRAM_CATALOG_CONTENT } from '../_components/content';

export const metadata: Metadata = {
  title: PROGRAM_CATALOG_CONTENT.program.name,
  description: PROGRAM_CATALOG_CONTENT.program.description,
};

export default async function KenaliHakmuPage({ searchParams }: KenaliHakmuPageProps) {
  const params = await searchParams;
  const query = Array.isArray(params.q) ? params.q[0] : params.q;
  const category = Array.isArray(params.kategori) ? params.kategori[0] : params.kategori;

  return <ProgramCatalogPage layanan={false} initialQuery={query} initialCategory={category} />;
}
