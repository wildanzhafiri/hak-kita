import type { Metadata } from 'next';
import { ProgramCatalogPage } from '../_components/program-catalog-page';
import { PROGRAM_CATALOG_CONTENT } from '../_components/content';

export const metadata: Metadata = {
  title: PROGRAM_CATALOG_CONTENT.program.name,
  description: PROGRAM_CATALOG_CONTENT.program.description,
};

export default function KenaliHakmuPage() {
  return <ProgramCatalogPage layanan={false} />;
}
