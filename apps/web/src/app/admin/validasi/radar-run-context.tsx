'use client';

import { createContext, useContext, type ReactNode } from 'react';
import { RadarRunIndicator } from './radar-run-indicator';
import type { RadarRunHandle } from './types';
import { useRadarRun } from './use-radar-run';

const RadarRunContext = createContext<RadarRunHandle | null>(null);

export function RadarRunProvider({ children }: { children: ReactNode }) {
  const run = useRadarRun();

  return (
    <RadarRunContext.Provider value={run}>
      {children}
      <RadarRunIndicator />
    </RadarRunContext.Provider>
  );
}

export function useRadarRunContext(): RadarRunHandle {
  const run = useContext(RadarRunContext);
  if (!run) throw new Error('RadarRunProvider is missing');
  return run;
}

export function useOptionalRadarRunContext(): RadarRunHandle | null {
  return useContext(RadarRunContext);
}
