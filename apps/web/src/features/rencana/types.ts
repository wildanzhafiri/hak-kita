import type { ReactNode } from 'react';
import type { Program, Wilayah } from '@hakkita/schema';
import type { Deadline } from '@hakkita/domain';

export interface UseRencanaOptions {
  programs: Program[];
  wilayah: Wilayah[];
  builtOn: string;
}

export interface RencanaState {
  programs: Program[];
  today: string;
  wilayah: Wilayah[];
  builtOn: string;
  saved: Program[];
  savedIsLoading: boolean;
  savedError: string | null;
  deadlines: Deadline[];
  toggleSaved: (programId: string) => void;
}

export interface RencanaFollowUpdatesProps {
  programs: Program[];
  isEmailAvailable: boolean;
}

export interface RencanaProviderProps extends UseRencanaOptions {
  children: ReactNode;
}

export interface RencanaShellProps {
  children: ReactNode;
}

export type SavedInformationKind = 'program' | 'layanan';

export interface SavedInformationTab {
  id: SavedInformationKind;
  label: string;
  emptyTitle: string;
  emptyDescription: string;
  browseHref: string;
  browseLabel: string;
}

export interface RencanaSavedCardProps {
  program: Program;
  isSaved: boolean;
  onPrepare: (program: Program) => void;
  onToggleSaved: (program: Program) => void;
}

export interface RencanaSavedProps {
  isEmailAvailable?: boolean;
}

export interface RencanaPreparationProps {
  program: Program;
  isEmailAvailable: boolean;
}

export interface DeadlineRowProps {
  deadline: Deadline;
}

export interface RencanaStepGuideProps {
  program: Program;
}

export interface RencanaStepHelpProps {
  program: Program;
}
