import type { Kategori, Program } from '@hakkita/schema';
import type { FormEvent } from 'react';

export type ProgramCategoryFilter = Kategori | 'all';

export interface ProgramListProps {
  programs: Program[];
  canManage?: boolean;
}

export interface ProgramRowProps {
  program: Program;
}

export interface ProgramCategoryBadgeProps {
  category: Program['kategori'];
}

export interface ProgramDetailProps {
  program: Program;
  canManage: boolean;
}

export interface ProgramDetailContentProps {
  program: Program;
}

export interface ProgramDeleteDialogProps {
  programId: string;
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
}

export interface ProgramEditorProps {
  program?: Program;
  onCancel?: () => void;
}

export type ProgramEditorTextField = Exclude<
  keyof ProgramEditorDraft,
  'requirements' | 'steps' | 'additionalSources'
>;

export interface ProgramEditorFieldsProps {
  draft: ProgramEditorDraft;
  isIdReadOnly: boolean;
  onFieldChange: (field: ProgramEditorTextField, value: string) => void;
  sources: ProgramSourceDraft[];
  onSourceChange: ProgramEditorSourcesProps['onSourceChange'];
  onAddSource: () => void;
  onRemoveSource: (index: number) => void;
}

export interface ProgramEditorFieldGroupProps {
  draft: ProgramEditorDraft;
  onFieldChange: (field: ProgramEditorTextField, value: string) => void;
}

export interface ProgramEditorIdentityFieldsProps extends ProgramEditorFieldGroupProps {
  isIdReadOnly: boolean;
}

export interface ProgramEditorRequirementsProps {
  requirements: ProgramRequirementDraft[];
  onRequirementChange: (index: number, field: keyof ProgramRequirementDraft, value: string) => void;
  onAddRequirement: () => void;
  onRemoveRequirement: (index: number) => void;
}

export interface ProgramEditorStepsProps {
  steps: string[];
  onStepChange: (index: number, value: string) => void;
  onAddStep: () => void;
  onRemoveStep: (index: number) => void;
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
  handleStepChange: (index: number, value: string) => void;
  handleAddStep: () => void;
  handleRemoveStep: (index: number) => void;
  handleSourceChange: (index: number, field: keyof ProgramSourceDraft, value: string) => void;
  handleAddSource: () => void;
  handleRemoveSource: (index: number) => void;
  handleSubmit: (event: FormEvent<HTMLFormElement>) => Promise<void>;
}

export interface ProgramRequirementDraft {
  text: string;
  sourceUrl: string;
}

export interface ProgramEditorDraft {
  id: string;
  kind: string;
  name: string;
  category: string;
  organizer: string;
  summary: string;
  audience: string;
  coverageLevel: string;
  coverageCode: string;
  gateType: string;
  requirements: ProgramRequirementDraft[];
  steps: string[];
  documents: string;
  sourceUrl: string;
  sourceType: string;
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
  program_name: string;
  draft_title: string | null;
  status: string;
  reviewed_at: string | null;
  source_url: string;
}
