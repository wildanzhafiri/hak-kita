import { notFound } from 'next/navigation';
import { buildWilayahIndex, wilayahName } from '@hakkita/domain';
import { Breadcrumbs } from '@/components/ui/breadcrumbs';
import { ProgramDetail } from '@/features/program/program-detail';
import { loadPrograms, loadPublicServices, loadWilayahFile } from '@/server/data';
import type { ProgramDetailPageProps } from './types';

export async function ProgramDetailPage({ id, layanan }: ProgramDetailPageProps) {
  const [items, wilayahFile] = await Promise.all([
    layanan ? loadPublicServices() : loadPrograms(),
    loadWilayahFile(),
  ]);
  const program = items.find((p) => p.id === id);
  if (!program) notFound();
  const index = buildWilayahIndex(wilayahFile.wilayah);
  const related = (program.terkait ?? [])
    .map((relatedId) => items.find((item) => item.id === relatedId))
    .filter((item) => item !== undefined);

  return (
    <div className="container pb-16 max-[640px]:pb-10">
      <div className="mb-7">
        <Breadcrumbs
          label="Jejak navigasi"
          items={[
            { label: 'Beranda', href: '/' },
            {
              label: layanan ? 'Layanan Publik' : 'Kenali Hakmu',
              href: layanan ? '/layanan' : '/kenali-hakmu',
            },
            { label: program.nama },
          ]}
        />
      </div>
      <ProgramDetail
        program={program}
        namaCakupan={wilayahName(index, program.cakupan.kode)}
        related={related}
      />
    </div>
  );
}
