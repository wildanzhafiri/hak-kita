'use client';

import { createContext, useContext } from 'react';
import type { AuthState } from './types';

export const AuthContext = createContext<AuthState>({
  user: null,
  isReady: true,
  isConfigured: false,
});

export function useAuth(): AuthState {
  return useContext(AuthContext);
}
