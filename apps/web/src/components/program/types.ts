import type { LucideIcon } from 'lucide-react';
import type { Program, TingkatVerifikasi, Wilayah } from '@hakkita/schema';
import type { WilayahIndex } from '@hakkita/domain';

export interface ProgramCardProps {
  program: Program;
  index: WilayahIndex;
  today: string;
}

export interface ProgramGridProps {
  programs: Program[];
  wilayah: Wilayah[];
  builtOn: string;
}

export interface PeriodChipProps {
  program: Program;
  today: string;
}

export interface VerifikasiBadgeProps {
  tingkat: TingkatVerifikasi;
}

export interface KategoriStyle {
  icon: LucideIcon;
  tone: 'mint' | 'peach';
}

export interface VerifikasiStyle {
  label: string;
  icon: LucideIcon;
}

export interface OfficialSiteLinkProps {
  url: string;
  className: string;
}
