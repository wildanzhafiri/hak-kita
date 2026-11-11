import type {
  Kategori,
  Periode,
  Program,
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

export interface StepProgress {
  completed: number[];
  stuck: number | null;
}

export interface Deadline {
  program: Program;
  status: PeriodStatus;
  closesOn: string | null;
  daysLeft: number | null;
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

export type ProfileCompleteness = 'kosong' | 'sebagian' | 'cukup';

export interface RecommendationOptions {
  today: string;
  wilayahIndex: WilayahIndex;
}

export interface Recommendation {
  program: Program;
  score: number;
  reasons: string[];
  checks: string[];
  periodStatus: PeriodStatus;
}
