import { todayWIB } from '@hakkita/domain';
import { PageShell } from '@/components/layout/page-shell';
import { ProgramList } from '@/features/program/program-list';
import { loadPrograms, loadPublicServices, loadWilayahFile } from '@/server/data';
import { PROGRAM_CATALOG_CONTENT } from './content';
import type { ProgramCatalogPageProps } from './types';

export async function ProgramCatalogPage({
  layanan,
  initialQuery = '',
  initialCategory,
}: ProgramCatalogPageProps) {
  const [items, wilayahFile] = await Promise.all([
    layanan ? loadPublicServices() : loadPrograms(),
    loadWilayahFile(),
  ]);
  const content = layanan ? PROGRAM_CATALOG_CONTENT.layanan : PROGRAM_CATALOG_CONTENT.program;

  return (
    <PageShell
      breadcrumbs={[{ label: content.name }]}
      title={content.title}
      description={content.description}
    >
      <ProgramList
        key={JSON.stringify([initialQuery, initialCategory])}
        initialQuery={initialQuery}
        initialCategory={initialCategory}
        programs={items}
        wilayah={wilayahFile.wilayah}
        placeholder={content.searchPlaceholder}
        servicePage={layanan}
        today={todayWIB()}
      />
    </PageShell>
  );
}
