import type { ReactNode } from 'react';
import type { RadarRunEvent, RadarRunKind } from '@hakkita/schema';
import type { RadarCandidateView, RadarProgramCandidateView } from '@/server/types';
import type { Database } from '@/lib/supabase/types';

export type RadarSettings = Database['public']['Tables']['program_radar_settings']['Row'];

export type RadarSettingAction = 'automatic_discovery' | 'monitoring';

export type RadarRunPhase = 'search' | 'read' | 'draft' | 'check';

export type RadarRunStatus = 'running' | 'done' | 'failed' | 'stopped';

export type RadarSourceCheckedEvent = Extract<RadarRunEvent, { type: 'source-checked' }>;

export type RadarOutcomeEvent = Extract<RadarRunEvent, { type: 'outcome' }>;

export type RadarTone = 'info' | 'success' | 'warning' | 'error';

export type RadarAgentStatus = 'waiting' | 'working' | 'done' | 'skipped' | 'failed';

export type RadarSourceTone = 'read' | 'same' | 'changed' | 'failed';

export interface RadarAgentState {
  status: RadarAgentStatus;
  note: string | null;
}

export type RadarAgents = Record<RadarRunPhase, RadarAgentState>;

export interface RadarSourceChip {
  host: string;
  tone: RadarSourceTone;
}

export interface RadarRoundResult {
  index: number;
  label: string;
  tone: RadarTone;
  text: string;
}

export interface RadarRunTally {
  examined: number;
  flagged: number;
  setAside: number;
}

export interface RadarRunState {
  kind: RadarRunKind;
  status: RadarRunStatus;
  startedAt: number;
  phase: RadarRunPhase | null;
  round: { index: number; total: number; label: string } | null;
  progress: { done: number; total: number };
  currentSource: string | null;
  tally: RadarRunTally;
  agents: RadarAgents;
  sources: RadarSourceChip[];
  rounds: RadarRoundResult[];
  summary: string | null;
  failure: string | null;
}

export interface RadarAgentListProps {
  state: RadarRunState;
}

export interface RadarAgentStepProps {
  phase: RadarRunPhase | 'monitor';
  agent: RadarAgentState;
  isLast: boolean;
  children?: ReactNode;
}

export interface RadarSourceChipsProps {
  sources: RadarSourceChip[];
  isWorking: boolean;
}

export interface RadarWorkingLabelProps {
  children: ReactNode;
  isWorking: boolean;
}

export interface RadarRoundResultsProps {
  rounds: RadarRoundResult[];
}

export interface RadarRunProgressProps {
  state: RadarRunState;
}

export interface RadarRunTallyProps {
  kind: RadarRunKind;
  tally: RadarRunTally;
}

export interface RadarRunPanelProps {
  state: RadarRunState;
  elapsedSeconds: number;
  onDismiss: () => void;
  onStop: () => void;
}

export interface RadarRunHandle {
  state: RadarRunState | null;
  elapsedSeconds: number;
  start: (kind: RadarRunKind) => Promise<void>;
  stop: () => void;
  dismiss: () => void;
}

export interface RadarReviewProps {
  initialCandidates: RadarCandidateView[];
  initialProgramCandidates: RadarProgramCandidateView[];
  initialSettings: RadarSettings;
}

export interface RadarControlsProps {
  initialSettings: RadarSettings;
}

export interface RadarProgramCandidatesProps {
  initialCandidates: RadarProgramCandidateView[];
}

export interface RadarCandidateCardProps {
  candidate: RadarCandidateView;
  onReviewed: (candidateId: string, newsId?: string) => void;
}

export interface RadarEmailPreviewProps {
  newsId: string;
  onDismiss: () => void;
}

export interface RadarEmailPreviewResult {
  subject: string;
  text: string;
  html: string;
  eligibleCount: number;
}

export interface RadarCandidateContextProps {
  candidate: RadarCandidateView;
}

export interface AdminAccessProps {
  initialMessage: string | null;
}
