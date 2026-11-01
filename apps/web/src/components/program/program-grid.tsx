'use client';

import { ProgramCard } from './program-card';
import type { ProgramGridProps } from './types';

export function ProgramGrid({ programs, horizontal = false, columns = 3 }: ProgramGridProps) {
  return (
    <div
      aria-label={horizontal ? 'Daftar program pilihan' : undefined}
      className={
        horizontal
          ? 'flex min-w-0 gap-[18px] overflow-x-auto overscroll-x-contain scroll-smooth snap-x snap-mandatory pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden motion-reduce:scroll-auto'
          : `grid ${columns === 2 ? 'grid-cols-2' : 'grid-cols-3'} gap-[22px] max-[760px]:grid-cols-1`
      }
      role={horizontal ? 'region' : undefined}
      tabIndex={horizontal ? 0 : undefined}
    >
      {programs.map((program) =>
        horizontal ? (
          <div
            className="w-full min-w-0 flex-[0_0_31.5%] snap-start [&>article]:h-full [&>article]:w-full max-[900px]:flex-[0_0_46%] max-[640px]:flex-[0_0_88%]"
            key={program.id}
          >
            <ProgramCard program={program} />
          </div>
        ) : (
          <ProgramCard key={program.id} program={program} />
        ),
      )}
    </div>
  );
}
