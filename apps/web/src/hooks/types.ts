import type { User } from '@supabase/supabase-js';
import type { Program } from '@hakkita/schema';
import type { Database } from '@/lib/supabase/types';

export type ProgramFollow = Database['public']['Tables']['program_follows']['Row'];

export interface ProgramFollowState {
  userId: string | null;
  rows: ProgramFollow[];
  isLoading: boolean;
  busyProgramId: string | null;
  error: string | null;
}

export interface UseProgramFollowsResult extends ProgramFollowState {
  isSignedIn: boolean;
  isConfigured: boolean;
  follow: (program: Program) => Promise<void>;
  unfollow: (programId: string) => Promise<void>;
  markSeen: (program: Program) => Promise<void>;
  retry: () => void;
}

export interface AuthState {
  user: User | null;
  isReady: boolean;
  isConfigured: boolean;
}

export interface EmailNotificationPreferenceState {
  userId: string | null;
  enabled: boolean;
  isLoading: boolean;
  isSaving: boolean;
  error: string | null;
}

export interface UseEmailNotificationPreferenceResult extends EmailNotificationPreferenceState {
  setEnabled: (enabled: boolean) => Promise<void>;
  retry: () => void;
}

export interface UseSavedIdsResult {
  ids: string[];
  toggle: (id: string) => Promise<void>;
  clear: () => Promise<void>;
  retry: () => Promise<void>;
  isLoading: boolean;
  isSaving: boolean;
  error: string | null;
}

export interface SavedProgramsSnapshot {
  ids: string[];
  isLoading: boolean;
  isSaving: boolean;
  error: string | null;
}
