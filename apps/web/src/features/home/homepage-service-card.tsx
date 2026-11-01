import Link from 'next/link';
import { ChevronRight, Files } from 'lucide-react';
import { programPath } from '@hakkita/domain';
import type { ServiceCardProps } from './types';

export function HomepageServiceCard({ program }: ServiceCardProps) {
  return (
    <Link
      className="group flex min-h-[116px] items-start gap-3.5 rounded-[10px] border border-[#dfe6ef] bg-white p-4 transition-colors hover:border-[#a9c7e8] motion-reduce:transition-none"
      href={programPath(program)}
    >
      <span className="grid size-[42px] shrink-0 place-items-center rounded-lg bg-[#edf5ff] text-[#196dcc]">
        <Files size={22} />
      </span>
      <span className="min-w-0 flex-1">
        <span className="block text-[15px] font-semibold text-[#25354b]">{program.nama}</span>
        <span className="mt-1 block text-[13px] leading-[1.7] text-[#687385]">
          {program.ringkasan}
        </span>
      </span>
      <ChevronRight
        className="mt-1 shrink-0 text-[#196dcc] transition-transform group-hover:translate-x-0.5 motion-reduce:transition-none"
        size={18}
      />
    </Link>
  );
}
