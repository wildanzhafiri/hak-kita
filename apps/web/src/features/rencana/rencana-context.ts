'use client';

import { createContext, useContext } from 'react';
import type { RencanaState } from './types';

export const RencanaContext = createContext<RencanaState | null>(null);

export function useRencanaState(): RencanaState {
  const state = useContext(RencanaContext);
  if (state === null) throw new Error('useRencanaState must be used inside RencanaProvider');
  return state;
}
