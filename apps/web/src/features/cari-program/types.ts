import type { Recommendation } from '@hakkita/domain';
import type { PreferensiProfil } from '@hakkita/schema';
import type { ProfileRegions } from '@/features/profil/types';
import type { FINDER_STEP_IDS } from './constants';

export type FinderStepId = (typeof FINDER_STEP_IDS)[number];

export interface FinderState {
  answers: PreferensiProfil;
  step: number;
  showResults: boolean;
  showProfileChoice: boolean;
}

export interface FinderOption {
  value: string;
  label: string;
}

export interface FinderOptionsProps {
  legend: string;
  name: string;
  options: readonly FinderOption[];
  values: readonly string[];
  isMultiple: boolean;
  onToggle: (value: string) => void;
}

export interface FinderRegionStepProps {
  regions: ProfileRegions | null;
  provinsi: string | null;
  kota: string | null;
  onChange: (provinsi: string | null, kota: string | null) => void;
}

export interface FinderWizardProps {
  state: FinderState;
  regions: ProfileRegions | null;
  regionsFailed: boolean;
  onChange: (changes: Partial<FinderState>) => void;
  onClose: () => void;
}

export interface FinderProfileChoiceProps {
  onUseProfile: () => void;
  onStartFresh: () => void;
}

export interface FinderResultsProps {
  answers: PreferensiProfil;
  regions: ProfileRegions | null;
  onClose: () => void;
}

export interface FinderResultCardProps {
  recommendation: Recommendation;
}

export interface FinderDialogProps {
  label: string;
}

export type FinderResultsState =
  | { status: 'loading' }
  | { status: 'error' }
  | { status: 'ready'; recommendations: Recommendation[] };
