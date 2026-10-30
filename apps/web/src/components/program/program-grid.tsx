'use client';

import { useMemo } from 'react';
import { buildWilayahIndex } from '@hakkita/domain';
import { useToday } from '@/hooks/use-today';
import { ProgramCard } from './program-card';
import type { ProgramGridProps } from './types';

export function ProgramGrid({ programs, wilayah, builtOn }: ProgramGridProps) {
  const today = useToday(builtOn);
  const index = useMemo(() => buildWilayahIndex(wilayah), [wilayah]);
  return (
    <div className="grid three">
      {programs.map((program) => (
        <ProgramCard key={program.id} program={program} index={index} today={today} />
      ))}
    </div>
  );
}
