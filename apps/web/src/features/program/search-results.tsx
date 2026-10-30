'use client';

import { useSearchParams } from 'next/navigation';
import { ProgramList } from './program-list';
import type { SearchResultsProps } from './types';

export function SearchResults({ programs, wilayah, builtOn }: SearchResultsProps) {
  const query = useSearchParams().get('q') ?? '';
  return (
    <ProgramList
      key={query}
      initialQuery={query}
      programs={programs}
      wilayah={wilayah}
      builtOn={builtOn}
    />
  );
}
