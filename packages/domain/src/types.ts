import type {
  Berkas,
  Kategori,
  Periode,
  Profile,
  Program,
  Syarat,
  TingkatVerifikasi,
  Wilayah,
} from '@hakkita/schema';

export interface ProgramFollowSnapshot {
  periode: Periode | null;
  periodStatus: PeriodStatus;
  closingSoon: boolean;
  syarat: string[];
  dokumen: string[];
  verifikasi: TingkatVerifikasi;
}

export type ProgramChange =
  'periode' | 'dibuka' | 'ditutup' | 'tenggat' | 'syarat' | 'dokumen' | 'verifikasi';

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

export interface StepProgress {
  completed: number[];
  stuck: number | null;
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
  | { kind: 'continue-guide'; program: Program }
  | { kind: 'open-official'; program: Program }
  | { kind: 'start-berkas'; program: ProgramWithBerkas }
  | { kind: 'review-saved'; program: Program }
  | { kind: 'explore' };

export interface NextStepInput {
  entries: readonly BerkasEntry[];
  saved: readonly Program[];
  guides?: readonly Program[];
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

export type ProgramKnowledgeSection = 'syarat' | 'langkah' | 'berkas' | 'kendala' | 'panduan';

export interface ProgramKnowledgePassage {
  id: string;
  programId: string;
  programName: string;
  section: ProgramKnowledgeSection;
  title: string;
  text: string;
  sourceUrl: string;
  checkedOn: string;
  verification: Exclude<TingkatVerifikasi, 'belum'>;
}

export interface ProgramKnowledgeSearchOptions {
  programId?: string;
  limit?: number;
}
