import type { ReactNode } from 'react';
import type { JenisProgram, Program, RadarRunEvent, RadarRunKind } from '@hakkita/schema';
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

export interface RadarControlsProps {
  initialSettings: RadarSettings;
}

export interface ValidationDetailRouteContext {
  params: Promise<{ id: string }>;
}

export interface RadarCandidateCardProps {
  candidate: RadarCandidateView;
  program?: Program | null;
  regionName?: string;
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

export interface AdminAccessProps {
  initialMessage: string | null;
}

export type ValidationFinding = 'new' | 'update';

export interface ValidationItem {
  id: string;
  finding: ValidationFinding;
  kind: JenisProgram;
  name: string;
  summary: string;
  detectedAt: string;
}

export interface ValidationQueueProps {
  items: ValidationItem[];
}

export interface ValidationMetricsProps {
  items: ValidationItem[];
}

export interface RadarNewsReviewProps {
  candidate: RadarCandidateView;
  program: Program | null;
  regionName: string;
}

export interface RadarRunSnapshot {
  id: string;
  state: RadarRunState;
  finishedAt: string | null;
}

export interface ValidationSectionProps {
  title: string;
  children: ReactNode;
}

export interface ValidationPreviewRow {
  label: string;
  values: string[];
}

export interface ValidationPreviewProps {
  rows: ValidationPreviewRow[];
}

export interface ValidationSource {
  label: string;
  url: string;
  quotes: string[];
  foundAt?: string;
}

export interface ValidationFullInfoProps {
  rows: ValidationPreviewRow[];
}

export interface ProgramPreviewRows {
  primary: ValidationPreviewRow[];
  detail: ValidationPreviewRow[];
}

export interface ValidationSourcesProps {
  sources: ValidationSource[];
}

export interface ValidationActionsProps {
  isConfirmed: boolean;
  isBusy: boolean;
  error: string | null;
  onConfirmChange: (isConfirmed: boolean) => void;
  onApprove: () => void;
  onEdit: () => void;
  onReject: () => void;
}

export interface RadarProgramReviewProps {
  candidate: RadarProgramCandidateView;
  regionName: string;
}
