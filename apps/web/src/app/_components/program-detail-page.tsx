import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ChevronRight } from 'lucide-react';
import { buildWilayahIndex, isLayanan, wilayahName } from '@hakkita/domain';
import { ProgramDetail } from '@/features/program/program-detail';
import { loadPrograms, loadWilayahFile } from '@/server/data';
import type { ProgramDetailPageProps } from './types';

export async function ProgramDetailPage({ id, layanan }: ProgramDetailPageProps) {
  const [programs, wilayahFile] = await Promise.all([loadPrograms(), loadWilayahFile()]);
  const program = programs.find((p) => p.id === id && isLayanan(p) === layanan);
  if (!program) notFound();
  const index = buildWilayahIndex(wilayahFile.wilayah);

  return (
    <div className="container pb-16 pt-6 max-[640px]:pb-10 max-[640px]:pt-4">
      <nav
        className="mb-7 flex min-w-0 items-center gap-2 text-xs text-[#687385]"
        aria-label="Jejak navigasi"
      >
        <Link className="shrink-0 hover:text-[#196dcc]" href="/">
          Beranda
        </Link>
        <ChevronRight className="shrink-0" size={14} />
        <Link className="shrink-0 hover:text-[#196dcc]" href={layanan ? '/layanan' : '/program'}>
          {layanan ? 'Layanan Publik' : 'Kenali Hakmu'}
        </Link>
        <ChevronRight className="shrink-0" size={14} />
        <span className="min-w-0 truncate text-[#25354b]" aria-current="page">
          {program.nama}
        </span>
      </nav>
      <ProgramDetail program={program} namaCakupan={wilayahName(index, program.cakupan.kode)} />
    </div>
  );
}
