import Link from 'next/link';
import { ChevronRight } from 'lucide-react';
import { programPath } from '@hakkita/domain';
import { KATEGORI_STYLE } from '@/components/program/constants';
import type { ServiceCardProps } from './types';

export function ServiceQuickLink({ program }: ServiceCardProps) {
  const { icon: CategoryIcon } = KATEGORI_STYLE[program.kategori];

  return (
    <Link
      className="group flex min-h-[70px] items-center gap-3.5 border-b border-[#e1e7ee] py-4 text-[15px] leading-6 text-[#33445b] transition-colors hover:text-[#196dcc] motion-reduce:transition-none"
      href={programPath(program)}
    >
      <CategoryIcon className="shrink-0 text-[#7d91ac]" size={22} strokeWidth={1.6} />
      <span className="min-w-0 flex-1">{program.nama}</span>
      <ChevronRight
        className="shrink-0 text-[#196dcc] transition-transform group-hover:translate-x-0.5 motion-reduce:transition-none"
        size={18}
      />
    </Link>
  );
}
