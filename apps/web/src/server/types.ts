import type { ProgramFollowSnapshot } from '@hakkita/domain';
import type { Program } from '@hakkita/schema';
import type { Database } from '@/lib/supabase/types';

export type EmailPreference = Database['public']['Tables']['program_email_preferences']['Row'];

export type ProgramFollow = Database['public']['Tables']['program_follows']['Row'];

export type ProgramNews = Database['public']['Tables']['program_news']['Row'];

export interface ProgramEmailRunOptions {
  onlyRecipientEmail?: string;
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
}

export interface ProgramSourceMonitorResult {
  checked: number;
  changed: string[];
  failed: string[];
}

export interface ApbdBudgetCategory {
  label: string;
  allocation: number;
  realization: number;
}

export interface ApbdBudgetSnapshot {
  year: number;
  period: string;
  dataReceived: string;
  categories: ApbdBudgetCategory[];
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
