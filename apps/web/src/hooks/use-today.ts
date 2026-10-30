'use client';

import { useSyncExternalStore } from 'react';
import { todayWIB } from '@hakkita/domain';

const subscribeNever = () => () => {};

export function useToday(builtOn: string): string {
  return useSyncExternalStore(
    subscribeNever,
    () => todayWIB(),
    () => builtOn,
  );
}
