import type { Metadata } from 'next';
import { ProgramCatalogPage } from '../_components/program-catalog-page';
import { PROGRAM_CATALOG_CONTENT } from '../_components/content';

export const metadata: Metadata = {
  title: PROGRAM_CATALOG_CONTENT.layanan.name,
  description: PROGRAM_CATALOG_CONTENT.layanan.description,
};

export default function LayananPage() {
  return <ProgramCatalogPage layanan />;
}
