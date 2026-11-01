import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { ProgramGrid } from '@/components/program/program-grid';
import type { FeaturedProgramsProps } from './types';

export function FeaturedPrograms({ programs }: FeaturedProgramsProps) {
  return (
    <section className="bg-white py-[43px] pb-[7px] max-[640px]:py-8">
      <div className="container">
        <div className="mb-[30px] flex items-end justify-between gap-6 max-[640px]:mb-[26px] max-[640px]:flex-wrap">
          <div>
            <h2 className="text-[clamp(26px,3vw,36px)] font-bold tracking-[-0.035em]">
              Program Unggulan
            </h2>
            <p className="mt-2.5 text-[15px] text-[#687385]">
              Jelajahi berbagai program bantuan dan kesempatan yang tersedia.
            </p>
          </div>
          <Link
            className="inline-flex shrink-0 items-center gap-2.5 text-sm font-semibold text-[#196dcc]"
            href="/program"
          >
            Lihat semua program <ArrowRight size={19} />
          </Link>
        </div>
        <ProgramGrid programs={programs} horizontal />
      </div>
    </section>
  );
}
