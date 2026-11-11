'use client';

import { ProgramCard } from './program-card';
import type { ProgramGridProps } from './types';

export function ProgramGrid({ programs, horizontal = false }: ProgramGridProps) {
  return (
    <div
      aria-label={horizontal ? 'Daftar program pilihan' : undefined}
      className={
        horizontal
          ? 'flex min-w-0 gap-[18px] overflow-x-auto overscroll-x-contain scroll-smooth snap-x snap-mandatory pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden max-[640px]:gap-4 motion-reduce:scroll-auto'
          : 'grid grid-cols-3 gap-5 max-[1200px]:grid-cols-2 max-[640px]:grid-cols-1'
      }
      role={horizontal ? 'region' : undefined}
      tabIndex={horizontal ? 0 : undefined}
    >
      {programs.map((program) =>
        horizontal ? (
          <div
            className="w-full min-w-0 flex-[0_0_calc((100%_-_73px)/3.2)] snap-start [&>article]:h-full [&>article]:w-full max-[1150px]:flex-[0_0_calc((100%_-_38px)/2.7)] max-[900px]:flex-[0_0_calc((100%_-_29px)/2.12)] max-[640px]:flex-[0_0_88%]"
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
