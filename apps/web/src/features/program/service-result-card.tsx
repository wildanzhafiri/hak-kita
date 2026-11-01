import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { programPath } from '@hakkita/domain';
import { KATEGORI_STYLE } from '@/components/program/constants';
import type { ServiceCardProps } from './types';

export function ServiceResultCard({ program }: ServiceCardProps) {
  const { icon: CategoryIcon } = KATEGORI_STYLE[program.kategori];

  return (
    <article className="flex min-w-0 flex-col rounded-xl border border-[#dce1e6] bg-white p-6 transition-colors hover:border-[#b9cde4] max-[640px]:p-5">
      <div className="mb-5 flex items-center justify-between gap-4 text-[#7791b2]">
        <span className="text-[11px] font-semibold text-[#5c78a0]">{program.kategori}</span>
        <CategoryIcon aria-hidden="true" size={25} strokeWidth={1.6} />
      </div>
      <span className="mb-2 text-[11px] text-[#7d8c9c]">Layanan</span>
      <h2 className="mb-2 text-[21px] font-semibold leading-[1.35] tracking-[-0.025em] text-[#25354b] max-[640px]:text-lg">
        <Link className="hover:text-[#196dcc]" href={programPath(program)}>
          {program.nama}
        </Link>
      </h2>
      <p className="mb-4 text-[13px] leading-[1.7] text-[#687385]">{program.penyelenggara}</p>
      <p className="text-sm leading-[1.75] text-[#526173]">{program.ringkasan}</p>
      <Link
        className="mt-auto inline-flex items-center gap-2.5 pt-6 text-[13px] font-semibold text-[#196dcc] hover:text-[#1458a3]"
        href={programPath(program)}
      >
        Lihat Panduan <ArrowRight aria-hidden="true" size={18} />
      </Link>
    </article>
  );
}
