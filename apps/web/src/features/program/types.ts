import type { ReactNode } from 'react';
import type { Kategori, Program, Wilayah } from '@hakkita/schema';
import type { DETAIL_TABS } from './content';

export interface ProgramFilters {
  query: string;
  draftQuery: string;
  kategori: string | null;
  provinsi: string | null;
  kabkota: string | null;
  sasaran: string[];
  manfaat: string[];
  jenjang: string | null;
  periodeStatus: string | null;
  urutan: string;
  kategoriOptions: Kategori[];
  provinsiOptions: Wilayah[];
  kabkotaOptions: Wilayah[];
  sasaranOptions: string[];
  manfaatOptions: readonly string[];
  jenjangOptions: readonly string[];
  results: Program[];
  setDraftQuery: (value: string) => void;
  submitQuery: () => void;
  selectKategori: (value: string) => void;
  selectProvinsi: (value: string) => void;
  selectKabkota: (value: string) => void;
  toggleSasaran: (value: string) => void;
  toggleManfaat: (value: string) => void;
  selectJenjang: (value: string) => void;
  clearMoreFilters: () => void;
  selectPeriodeStatus: (value: string) => void;
  selectUrutan: (value: string) => void;
  clearSasaran: () => void;
  clearQuery: () => void;
  clearFilters: () => void;
  reset: () => void;
}

export interface ProgramFiltersProps {
  filters: ProgramFilters;
}

export interface ActiveFilterChip {
  id: string;
  label: string;
  remove: () => void;
}

export interface ProgramFilterTriggerProps {
  label: string;
}

export interface ProgramCategoryFieldProps extends ProgramFiltersProps {
  hideLabel?: boolean;
}

export interface ProgramFilterFieldProps {
  label: string;
  hideLabel?: boolean;
  children: ReactNode;
}

export interface ProgramFilterFieldsProps extends ProgramFiltersProps {
  layout: 'sheet' | 'stacked';
  servicePage: boolean;
}

export interface UseProgramFiltersOptions {
  programs: Program[];
  wilayah: Wilayah[];
  initialQuery: string;
  servicePage?: boolean;
  today?: string;
}

export interface ProgramListProps {
  programs: Program[];
  wilayah: Wilayah[];
  initialQuery?: string;
  placeholder?: string;
  servicePage?: boolean;
  today?: string;
}

export interface ServiceCardProps {
  program: Program;
}

export interface ResultPaginationProps {
  page: number;
  pageCount: number;
  ariaLabel: string;
  onPageChange: (page: number) => void;
}

export interface ProgramFilterBarProps {
  filters: ProgramFilters;
  placeholder: string;
  mode?: 'search' | 'filters';
  stacked?: boolean;
  servicePage?: boolean;
}

export interface SearchResultsProps {
  programs: Program[];
  wilayah: Wilayah[];
  today: string;
}

export interface ProgramDetailProps {
  program: Program;
  namaCakupan: string;
  related?: Program[];
}

export interface ServiceDetailProps {
  program: Program;
  namaCakupan: string;
  related: Program[];
}

export interface ServiceRelatedSectionProps {
  related: Program[];
}

export interface DetailProgramSectionProps {
  program: Program;
}

export interface SummarySectionProps {
  program: Program;
  namaCakupan: string;
}

export interface RequirementsSectionProps {
  program: Program;
}

export interface StepsSectionProps {
  program: Program;
}

export interface FollowProgramButtonProps {
  program: Program;
  showDescription?: boolean;
  actionLabel?: string;
  actionTone?: 'primary' | 'secondary';
}

export interface DetailSectionProps {
  id: string;
  title: string;
  children: ReactNode;
  variant?: 'program';
}

export interface DetailFactProps {
  label: string;
  children: ReactNode;
}

export type DetailTab = (typeof DETAIL_TABS)[number]['id'];

export interface DetailTabsProps {
  activeTab: DetailTab;
  onSelect: (tab: DetailTab) => void;
}

export interface DetailTabPanelProps {
  id: DetailTab;
  isActive: boolean;
  children: ReactNode;
}
