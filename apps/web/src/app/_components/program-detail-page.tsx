import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ChevronRight } from 'lucide-react';
import { buildWilayahIndex, wilayahName } from '@hakkita/domain';
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
    <div
      className={`container pb-16 max-[640px]:pb-10 ${layanan ? 'pt-[27px] min-[1100px]:w-[min(1440px,calc(100%-96px))]! max-[640px]:pt-5' : 'pt-6 max-[640px]:pt-4'}`}
    >
      <nav
        className="mb-7 flex min-w-0 items-center gap-2 text-xs text-[#687385]"
        aria-label="Jejak navigasi"
      >
        <Link className="shrink-0 hover:text-[#196dcc]" href="/">
          Beranda
        </Link>
        <ChevronRight className="shrink-0" size={14} />
        <Link
          className="shrink-0 hover:text-[#196dcc]"
          href={layanan ? '/layanan' : '/kenali-hakmu'}
        >
          {layanan ? 'Layanan Publik' : 'Kenali Hakmu'}
        </Link>
        <ChevronRight className="shrink-0" size={14} />
        <span className="min-w-0 truncate text-[#25354b]" aria-current="page">
          {program.nama}
        </span>
      </nav>
      <ProgramDetail
        program={program}
        namaCakupan={wilayahName(index, program.cakupan.kode)}
        related={related}
      />
    </div>
  );
}
