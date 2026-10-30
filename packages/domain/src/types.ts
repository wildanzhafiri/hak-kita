import type { Kategori, Wilayah } from '@hakkita/schema';

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
