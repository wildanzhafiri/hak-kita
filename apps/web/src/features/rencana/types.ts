import type { ReactNode } from 'react';
import type { LucideIcon } from 'lucide-react';
import type { ObstacleReportStage, Program, Wilayah } from '@hakkita/schema';
import type {
  BerkasEntry,
  BerkasReadiness,
  Deadline,
  NextStep,
  ProgramWithBerkas,
} from '@hakkita/domain';

export interface RencanaEntry extends BerkasEntry {
  note: string;
}

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
  entries: RencanaEntry[];
  untouched: ProgramWithBerkas[];
  saved: Program[];
  guided: Program[];
  savedIsLoading: boolean;
  savedError: string | null;
  berkasIsLoading: boolean;
  berkasError: string | null;
  deadlines: Deadline[];
  nextStep: NextStep;
  overall: BerkasReadiness;
  clearBerkas: (programId: string) => void;
  toggleSaved: (programId: string) => void;
  clearAll: () => void;
}

export interface RencanaFollowUpdatesProps {
  programs: Program[];
  isEmailAvailable: boolean;
}

export interface RencanaSummaryProps {
  isEmailAvailable?: boolean;
}

export interface RencanaProviderProps extends UseRencanaOptions {
  children: ReactNode;
}

export interface RencanaShellProps {
  children: ReactNode;
}

export interface RencanaHeaderProps {
  section: string;
}

export type RencanaCountKey = 'berkas' | 'tersimpan' | 'tenggat';

export interface RencanaNavItem {
  href: string;
  label: string;
  icon: LucideIcon;
  count: RencanaCountKey | null;
}

export interface RencanaNavProps {
  counts: Record<RencanaCountKey, number>;
}

export interface NextStepAction {
  label: string;
  href: string;
  external: boolean;
}

export interface NextStepCopy {
  title: string;
  detail: string;
  action: NextStepAction;
  readiness: BerkasReadiness | null;
}

export interface NextStepCardProps {
  step: NextStep;
}

export interface RencanaItemProps {
  entry: RencanaEntry;
  onClear: () => void;
}

export interface RencanaSuggestionsProps {
  programs: ProgramWithBerkas[];
  heading: string;
}

export interface BerkasMiniRowProps {
  entry: RencanaEntry;
}

export interface DeadlineRowProps {
  deadline: Deadline;
}

export interface ClearAllButtonProps {
  onConfirm: () => void;
}

export interface RencanaStepGuideProps {
  program: Program;
}

export interface RencanaStepHelpProps {
  program: Program;
}

export interface RencanaObstacleReportProps {
  programId: string;
}

export interface RencanaTurnstileProps {
  siteKey: string;
  resetKey: number;
  onToken: (token: string) => void;
}

export interface ObstacleReportResponse {
  accepted?: boolean;
  error?: string;
}

export type SelectedObstacleStage = ObstacleReportStage | '';
