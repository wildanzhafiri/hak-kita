import Link from 'next/link';
import { ChevronRight, Files } from 'lucide-react';
import { programPath } from '@hakkita/domain';
import type { ServiceCardProps } from './types';

export function HomepageServiceCard({ program }: ServiceCardProps) {
  return (
    <Link
      className="group flex min-h-28 min-w-0 items-center gap-3 rounded-[14px] border border-[#b8cbe0] bg-white p-[18px] shadow-[0_3px_10px_rgba(35,59,85,0.09)] transition-[border-color,background-color,box-shadow,transform] duration-[180ms] hover:-translate-y-[3px] hover:border-[#aac8ea] hover:bg-[#f8fbff] hover:shadow-[0_7px_18px_rgba(25,109,204,0.11)] focus-visible:outline-[3px] focus-visible:outline-offset-[3px] focus-visible:outline-[#196dcc] max-[639px]:min-h-[104px] max-[639px]:p-4 motion-reduce:transform-none motion-reduce:transition-none"
      href={programPath(program)}
    >
      <span className="grid size-[42px] shrink-0 place-items-center rounded-[11px] bg-[#edf5ff] text-[#196dcc]">
        <Files aria-hidden="true" size={22} />
      </span>
      <span className="min-w-0 flex-1">
        <span className="mb-[5px] block text-[15px] font-semibold leading-[1.45] text-[#1b304c]">
          {program.nama}
        </span>
        <span className="line-clamp-2 text-[13px] leading-[1.55] text-[#687385]">
          {program.ringkasan}
        </span>
      </span>
      <ChevronRight
        aria-hidden="true"
        className="shrink-0 text-[#6587b2] transition-transform duration-[180ms] group-hover:translate-x-0.5 motion-reduce:transition-none"
        size={18}
      />
    </Link>
  );
}
