import Link from 'next/link';
import { ChevronRight, Files } from 'lucide-react';
import { programPath } from '@hakkita/domain';
import { KATEGORI_STYLE } from '@/components/program/constants';
import { SERVICE_PRESENTATION } from './constants';
import type { ServiceCardProps } from './types';

export function ServiceQuickLink({ program }: ServiceCardProps) {
  const CategoryIcon =
    SERVICE_PRESENTATION[program.id]?.icon ?? KATEGORI_STYLE[program.kategori]?.icon ?? Files;

  return (
    <Link
      className="group flex min-h-[70px] items-center gap-3.5 py-4 text-[15px] leading-6 text-[#2674ca] transition-colors hover:text-[#1458a3] motion-reduce:transition-none"
      href={programPath(program)}
    >
      <CategoryIcon className="shrink-0 text-[#7b95b7]" size={22} strokeWidth={1.6} />
      <span className="min-w-0 flex-1">{program.nama}</span>
      <ChevronRight
        className="shrink-0 text-[#196dcc] transition-transform group-hover:translate-x-0.5 motion-reduce:transition-none"
        size={18}
      />
    </Link>
  );
}
