'use client';

import { useMemo } from 'react';
import { buildDeadline, sortDeadlines } from '@hakkita/domain';
import type { Program } from '@hakkita/schema';
import { useSavedIds } from '@/hooks/use-saved-ids';
import { useToday } from '@/hooks/use-today';
import type { RencanaState, UseRencanaOptions } from './types';

export function useRencana({ programs, wilayah, builtOn }: UseRencanaOptions): RencanaState {
  const today = useToday(builtOn);
  const savedIds = useSavedIds();

  return useMemo(() => {
    const saved = savedIds.ids
      .map((id) => programs.find((program) => program.id === id))
      .filter((program): program is Program => program !== undefined);

    return {
      programs,
      today,
      wilayah,
      builtOn,
      saved,
      savedIsLoading: savedIds.isLoading,
      savedError: savedIds.error,
      deadlines: sortDeadlines(saved.map((program) => buildDeadline(program, today))),
      toggleSaved: savedIds.toggle,
    };
  }, [programs, wilayah, builtOn, today, savedIds]);
}
