import type { Berkas, Kategori, Profile, Program, Syarat, Wilayah } from '@hakkita/schema';

export type WilayahIndex = ReadonlyMap<string, Wilayah>;

export type ProgramWithBerkas = Program & { berkas: Berkas };

export type PeriodStatus =
  'dibuka' | 'ditutup' | 'belum-dibuka' | 'sepanjang-tahun' | 'tidak-diketahui';

export interface CheckResult {
  errors: string[];
  warnings: string[];
}

export interface ProgramFilter {
  query: string;
  kategori: Kategori | null;
  wilayah: string | null;
}

export type BerkasAnswers = Record<string, string>;

export interface BerkasProgress {
  answers: BerkasAnswers;
  checked: string[];
  note: string;
}

export interface BerkasReadiness {
  ready: number;
  total: number;
}

export interface BerkasEntry {
  program: ProgramWithBerkas;
  readiness: BerkasReadiness;
  hasUnanswered: boolean;
}

export interface Deadline {
  program: Program;
  status: PeriodStatus;
  closesOn: string | null;
  daysLeft: number | null;
}

export type NextStep =
  | { kind: 'continue-berkas'; entry: BerkasEntry; deadline: Deadline }
  | { kind: 'open-official'; program: Program }
  | { kind: 'start-berkas'; program: ProgramWithBerkas }
  | { kind: 'review-saved'; program: Program }
  | { kind: 'explore' };

export interface NextStepInput {
  entries: readonly BerkasEntry[];
  saved: readonly Program[];
  today: string;
}

export type MatchStatus = 'berpotensi-sesuai' | 'perlu-dicek';

export interface MatchResult {
  program: Program;
  status: MatchStatus;
  reasons: Syarat[];
  checks: string[];
  officialCheck: string;
}

export interface MatchOptions {
  profile: Profile;
  today: string;
  wilayahIndex: WilayahIndex;
}
