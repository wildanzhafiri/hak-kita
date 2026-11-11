import type { JenisProgram, Program } from '@hakkita/schema';
import type { FormEvent, ReactNode } from 'react';

export type ProgramKindFilter = JenisProgram | 'all';

export interface ProgramListProps {
  programs: Program[];
  canManage?: boolean;
}

export interface ProgramRowProps {
  program: Program;
}

export interface ProgramKindBadgeProps {
  kind: JenisProgram;
}

export interface ProgramDetailProps {
  program: Program;
  canManage: boolean;
  children?: ReactNode;
}

export interface ProgramDeleteDialogProps {
  programId: string;
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
}

export interface ProgramEditorProps {
  program?: Program;
  onCancel?: () => void;
  onSave?: (program: Program) => Promise<string | null>;
  onSaved?: () => void;
  hideVerification?: boolean;
}

export type ProgramEditorTextField = Exclude<
  keyof ProgramEditorDraft,
  'requirements' | 'additionalSources'
>;

export interface EditorFieldProps {
  label: string;
  hint?: string;
  isRequired?: boolean;
  className?: string;
  children: ReactNode;
}

export interface ProgramEditorFieldGroupProps {
  draft: ProgramEditorDraft;
  onFieldChange: (field: ProgramEditorTextField, value: string) => void;
}

export interface ProgramEditorIdentityFieldsProps extends ProgramEditorFieldGroupProps {
  isIdReadOnly: boolean;
}

export interface ProgramEditorSourceFieldsProps
  extends ProgramEditorFieldGroupProps, ProgramEditorSourcesProps {
  hideVerification?: boolean;
}

export interface ProgramEditorRequirementsProps {
  requirements: ProgramRequirementDraft[];
  onRequirementChange: (index: number, field: keyof ProgramRequirementDraft, value: string) => void;
  onAddRequirement: () => void;
  onRemoveRequirement: (index: number) => void;
}

export interface ProgramEditorSourcesProps {
  sources: ProgramSourceDraft[];
  onSourceChange: (index: number, field: keyof ProgramSourceDraft, value: string) => void;
  onAddSource: () => void;
  onRemoveSource: (index: number) => void;
}

export interface ProgramSourceDraft {
  url: string;
  type: string;
  quote: string;
}

export interface UseProgramEditorResult {
  draft: ProgramEditorDraft;
  isSaving: boolean;
  errorMessage: string | null;
  handleFieldChange: (field: ProgramEditorTextField, value: string) => void;
  handleRequirementChange: (
    index: number,
    field: keyof ProgramRequirementDraft,
    value: string,
  ) => void;
  handleAddRequirement: () => void;
  handleRemoveRequirement: (index: number) => void;
  handleSourceChange: (index: number, field: keyof ProgramSourceDraft, value: string) => void;
  handleAddSource: () => void;
  handleRemoveSource: (index: number) => void;
  handleSubmit: (event: FormEvent<HTMLFormElement>) => Promise<void>;
}

export interface ProgramRequirementDraft {
  text: string;
  sourceUrl: string;
  quote: string;
}

export interface ProgramEditorDraft {
  id: string;
  kind: string;
  name: string;
  category: string;
  organizer: string;
  summary: string;
  about: string;
  cost: string;
  audience: string;
  coverageLevel: string;
  coverageCode: string;
  gateType: string;
  requirements: ProgramRequirementDraft[];
  steps: string;
  documents: string;
  sourceUrl: string;
  sourceType: string;
  sourceQuote: string;
  additionalSources: ProgramSourceDraft[];
  periodType: string;
  periodOpen: string;
  periodClose: string;
  verification: string;
  checkedAt: string;
}

export interface AdminAccessProps {
  initialMessage: string | null;
}

export interface RadarHistoryProps {
  candidates: RadarHistoryCandidate[];
}

export interface RadarHistoryCandidate {
  id: string;
  kind: 'news' | 'program';
  program_id: string | null;
  program_name: string;
  draft_title: string | null;
  status: string;
  reviewed_at: string | null;
  source_url: string;
}

export interface ProgramUpdateEmailProps {
  programId: string;
}

export interface ProgramUpdateEmailPreview {
  followers: number;
  recipients: number;
  changes: string[];
  subject: string | null;
  html: string | null;
  text: string | null;
  isExample: boolean;
}

export interface ProgramNewsEmailPreview {
  subject: string;
  html: string;
  text: string;
  eligibleCount: number;
}

export interface ProgramNewsDraft {
  title: string;
  summary: string;
  sourceUrl: string;
  publishedOn: string;
}

export interface ProgramNewsEmailProps {
  programId: string;
}

export interface EmailPreviewFrameProps {
  summary: string;
  defaultOpen?: boolean;
  title: string;
  html: string | null;
  text: string | null;
  textToggle: string;
}

export interface ProgramFollowerNoticeProps {
  programId: string;
  refreshKey: number;
  hasSavedChange: boolean;
}
