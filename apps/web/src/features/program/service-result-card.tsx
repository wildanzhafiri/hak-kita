import Link from 'next/link';
import { ArrowRight, Files } from 'lucide-react';
import { programPath } from '@hakkita/domain';
import { SaveButton } from '@/components/program/save-button';
import { SERVICE_PRESENTATION } from './constants';
import type { ServiceCardProps } from './types';

export function ServiceResultCard({ program }: ServiceCardProps) {
  const presentation = SERVICE_PRESENTATION[program.id];
  const CategoryIcon = presentation?.icon ?? Files;

  return (
    <article className="flex min-h-[330px] min-w-0 flex-col rounded-2xl border border-[#dce1e6] bg-white p-6 transition-colors hover:border-[#b9cde4] max-[640px]:min-h-0 max-[640px]:p-5">
      <div className="mb-7 flex items-center justify-between gap-4 text-[#7791b2]">
        <span className="text-[13px] font-semibold text-[#5c78a0]">
          {presentation?.category ?? program.kategori}
        </span>
        <CategoryIcon aria-hidden="true" size={24} strokeWidth={1.7} />
      </div>
      <span className="mb-2 text-[11px] text-[#7d8c9c]">Layanan</span>
      <h2 className="mb-2 text-[21px] font-semibold leading-[1.35] tracking-[-0.025em] text-[#25354b] max-[640px]:text-lg">
        <Link className="hover:text-[#196dcc]" href={programPath(program)}>
          {program.nama}
        </Link>
      </h2>
      <p className="mb-4 line-clamp-1 text-[13px] leading-[1.7] text-[#687385]">
        {program.penyelenggara}
      </p>
      <p className="mb-5 line-clamp-3 text-sm leading-[1.7] text-[#526173]">{program.ringkasan}</p>
      <div className="mt-auto flex items-center justify-between gap-4 border-t border-[#dce1e6] pt-4">
        <Link
          className="inline-flex items-center gap-2.5 text-[13px] font-semibold text-[#196dcc] hover:text-[#1458a3]"
          href={programPath(program)}
        >
          Lihat Panduan <ArrowRight aria-hidden="true" size={18} />
        </Link>
        <SaveButton
          className="!border-0 !bg-transparent !text-[#196dcc] hover:!bg-[#edf5ff] aria-pressed:!bg-[#edf5ff] aria-pressed:!text-[#196dcc]"
          program={program}
        />
      </div>
    </article>
  );
}
