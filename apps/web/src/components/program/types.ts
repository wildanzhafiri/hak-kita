import type { LucideIcon } from 'lucide-react';
import type { Program, TingkatVerifikasi } from '@hakkita/schema';

export interface ProgramCardProps {
  program: Program;
}

export interface ProgramGridProps {
  programs: Program[];
  horizontal?: boolean;
  columns?: 2 | 3;
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

export interface SaveButtonProps {
  program: Pick<Program, 'id' | 'nama'>;
  variant?: 'icon' | 'button';
  className?: string;
}

export interface OfficialSiteLinkProps {
  url: string;
  className: string;
}
