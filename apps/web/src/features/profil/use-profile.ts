'use client';

import { createContext, useContext } from 'react';
import { EMPTY_PREFERENCES } from '@hakkita/domain';
import type { ProfileContextValue } from './types';

export const ProfileContext = createContext<ProfileContextValue>({
  status: 'idle',
  nama: '',
  preferensi: EMPTY_PREFERENCES,
  save: async () => null,
  clearPreferences: async () => null,
});

export function useProfile(): ProfileContextValue {
  return useContext(ProfileContext);
}
