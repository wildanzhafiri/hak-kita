import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { programPath } from '@hakkita/domain';
import { SaveButton } from '@/components/program/save-button';
import type { ServiceCardProps } from './types';

export function ServiceResultCard({ program }: ServiceCardProps) {
  return (
    <article className="flex min-h-[218px] min-w-0 flex-col rounded-xl border border-[#d3e0ee] bg-white p-5 shadow-[0_3px_12px_rgba(35,59,85,0.08)] transition-[border-color,box-shadow,transform] hover:-translate-y-0.5 hover:border-[#a9c6e7] hover:shadow-[0_5px_14px_rgba(35,59,85,0.09)] motion-reduce:transition-none max-[640px]:min-h-0 max-[640px]:p-[18px]">
      <h2 className="mb-1 min-w-0 text-lg leading-[1.45] font-semibold text-[#253044]">
        <Link className="break-words hover:text-[#196dcc]" href={programPath(program)}>
          {program.nama}
        </Link>
      </h2>
      <p className="mb-4 line-clamp-3 text-sm leading-[1.6] text-[#536477]">{program.ringkasan}</p>
      <div className="mt-auto flex items-center justify-between gap-3 border-t border-[#e8edf4] pt-2">
        <Link
          className="inline-flex min-h-11 min-w-0 items-center gap-2.5 text-sm font-semibold text-[#196dcc] hover:text-[#1458a3]"
          href={programPath(program)}
        >
          <span>Lihat panduan</span>{' '}
          <ArrowRight aria-hidden="true" className="shrink-0" size={18} />
        </Link>
        <SaveButton
          className="!shrink-0 !border-0 !bg-transparent !text-[#196dcc] hover:!bg-[#edf5ff] aria-pressed:!bg-[#edf5ff] aria-pressed:!text-[#196dcc]"
          program={program}
        />
      </div>
    </article>
  );
}
