import type { ProgramFollowSnapshot } from '@hakkita/domain';
import type { PreferensiProfil, Program, RadarProgramDraft, RadarRunEvent } from '@hakkita/schema';
import type { Database } from '@/lib/supabase/types';

export type EmailPreference = Database['public']['Tables']['program_email_preferences']['Row'];

export type ProgramFollow = Database['public']['Tables']['program_follows']['Row'];

export type ProgramNews = Database['public']['Tables']['program_news']['Row'];

export type RadarCandidate = Database['public']['Tables']['program_radar_candidates']['Row'];

export type RadarAccessState =
  | { status: 'unconfigured' }
  | { status: 'anonymous' }
  | { status: 'forbidden' }
  | { status: 'authorized'; userId: string; email: string };

export interface RadarCandidateView extends RadarCandidate {
  program_name: string;
}

export type RadarProgramCandidate =
  Database['public']['Tables']['program_radar_program_candidates']['Row'];

export interface RadarProgramCandidateView extends RadarProgramCandidate {
  record: RadarProgramDraft;
}

export interface ProgramEmailRunOptions {
  onlyRecipientEmail?: string;
  onlyProgramId?: string;
  note?: string;
}

export interface ProgramUpdateEmailPreview {
  followers: number;
  recipients: number;
  changes: string[];
  subject: string | null;
  html: string | null;
  text: string | null;
  isExample: boolean;
}

export interface ProgramEmailBaseline {
  snapshot: ProgramFollowSnapshot;
  shouldSeed: boolean;
}

export interface CurrentEmailProgram {
  program: Program;
  updatedAt: string;
}

export interface DataIssue {
  path: PropertyKey[];
  message: string;
}

export interface ProgramSourceFingerprint {
  fingerprint: string;
  etag: string | null;
  lastModified: string | null;
  contentType: string | null;
  html: string | null;
}

export interface RadarTextResponse {
  body: string;
  url: string;
  status: number;
}

export interface RadarCrawlPage {
  url: string;
  depth: number;
}

export interface RadarOfficialPage {
  url: string;
  text: string;
  fingerprint: string;
  etag: string | null;
  lastModified: string | null;
}

export interface ProgramSourceTarget {
  sourceUrl: string;
  programs: Program[];
}

export interface RadarRunCarry {
  searched?: number;
  queued?: number;
  failed?: string[];
  usedFallbackSearch?: boolean;
  checked?: number;
  changed?: string[];
}

export interface RadarRunCursor {
  index: number;
  seed: number | null;
  carry: RadarRunCarry;
}

export interface RadarRunSlice {
  startIndex: number;
  deadline: number;
  seed?: number | null;
  carry?: RadarRunCarry;
}

export interface ProgramSourceMonitorResult {
  checked: number;
  changed: string[];
  failed: string[];
  next?: RadarRunCursor | null;
}

export interface ProgramDiscoveryResult {
  searched: number;
  queued: number;
  failed: string[];
  next?: RadarRunCursor | null;
}

export type RadarRunReporter = (event: RadarRunEvent) => void;

export interface DiscoverySearchQuery {
  query: string;
  label: string;
}

export interface ApbdBudgetCategory {
  label: string;
  allocation: number;
  realization: number;
}

export interface ApbdBudgetLine extends ApbdBudgetCategory {
  realizationPercent: number;
}

export interface BudgetOption {
  value: string;
  label: string;
}

export interface ApbdBudgetFilters {
  years: BudgetOption[];
  periods: BudgetOption[];
  provinces: BudgetOption[];
  regions: BudgetOption[];
  maxPeriod: number;
}

export interface ApbdBudgetSnapshot {
  year: number;
  period: string;
  periodNumber: number;
  dataReceived: string;
  regionLabel: string;
  sourceUrl: string;
  totalAllocation: number;
  totalRealization: number;
  realizationPercent: number;
  categories: ApbdBudgetCategory[];
  expenses: ApbdBudgetLine[];
  revenues: ApbdBudgetLine[];
}

export interface ProgramEmailMessage {
  to: string;
  subject: string;
  text: string;
  html: string;
  idempotencyKey: string;
}

export interface ProgramEmailDetail {
  title: string;
  notes: string[];
}

export interface ProgramEmailSource {
  label: string;
  url: string;
}

export interface ProgramEmailNote {
  title: string;
  body: string;
}

export interface ProgramEmailTemplate {
  heading: string;
  intro: string;
  programName: string;
  contextLabel: string;
  contextTitle?: string;
  contextBody?: string;
  contextMeta?: string;
  details?: ProgramEmailDetail[];
  note?: ProgramEmailNote;
  actionLabel: string;
  actionUrl: string;
  sources: ProgramEmailSource[];
  settingsUrl: string;
}

export interface ProgramEmailRunResult {
  checked: number;
  sent: number;
  failed: number;
}

export type GatewayLanguageModel = ReturnType<
  ReturnType<typeof import('@ai-sdk/openai-compatible').createOpenAICompatible>['chatModel']
>;

export type UserProfileResult =
  | { status: 'anonymous' }
  | { status: 'error' }
  | { status: 'ready'; nama: string; preferensi: PreferensiProfil };

export interface CurrentUser {
  id: string;
  email: string;
}
