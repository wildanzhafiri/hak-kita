'use client';

import { RencanaContext } from './rencana-context';
import type { RencanaProviderProps } from './types';
import { useRencana } from './use-rencana';

export function RencanaProvider({ children, ...options }: RencanaProviderProps) {
  const state = useRencana(options);
  return <RencanaContext.Provider value={state}>{children}</RencanaContext.Provider>;
}
