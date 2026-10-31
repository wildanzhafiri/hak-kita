import type { Profile, ProfileGroup, AgeBand, Program, Wilayah } from '@hakkita/schema';
import type { MatchResult } from '@hakkita/domain';

export type QuestionKey = 'kelompok' | 'rentangUsia' | 'wilayah' | 'tahunLulus';

export interface ConditionOption {
  value: string;
  label: string;
}

export interface ConditionQuestionContent {
  key: QuestionKey;
  title: string;
  description: string;
}

export interface ConditionCheckerProps {
  programs: Program[];
  wilayah: Wilayah[];
  builtOn: string;
}

export interface ConditionQuestionProps {
  title: string;
  description: string;
  value: string | null;
  options: ConditionOption[];
  onSelect: (value: string) => void;
}

export interface MatchResultsProps {
  programs: Program[];
  wilayah: Wilayah[];
  profile: Profile;
  today: string;
  onEdit: () => void;
  onReset: () => void;
}

export interface MatchResultCardProps {
  result: MatchResult;
  today: string;
}

export interface UseConditionProfileResult {
  profile: Profile;
  update: (changes: Partial<Profile>) => void;
  reset: () => void;
}

export interface GroupOption extends ConditionOption {
  value: ProfileGroup;
}

export interface AgeOption extends ConditionOption {
  value: AgeBand;
}
