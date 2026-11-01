import type { ReactNode } from 'react';
import type { Program, Wilayah } from '@hakkita/schema';
import type { DETAIL_TABS } from './content';

export interface ProgramFilters {
  query: string;
  kategori: string | null;
  provinsi: string | null;
  kabkota: string | null;
  kategoriOptions: string[];
  provinsiOptions: Wilayah[];
  kabkotaOptions: Wilayah[];
  results: Program[];
  setQuery: (value: string) => void;
  selectKategori: (value: string) => void;
  selectProvinsi: (value: string) => void;
  selectKabkota: (value: string) => void;
  reset: () => void;
}

export interface UseProgramFiltersOptions {
  programs: Program[];
  wilayah: Wilayah[];
  initialQuery: string;
  servicePage?: boolean;
}

export interface ProgramListProps {
  programs: Program[];
  wilayah: Wilayah[];
  initialQuery?: string;
  placeholder?: string;
  servicePage?: boolean;
}

export interface ServiceCardProps {
  program: Program;
}

export interface ProgramFilterBarProps {
  filters: ProgramFilters;
  placeholder: string;
  mode?: 'search' | 'filters';
  stacked?: boolean;
}

export interface SearchResultsProps {
  programs: Program[];
  wilayah: Wilayah[];
}

export interface ProgramDetailProps {
  program: Program;
  namaCakupan: string;
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

export interface DetailSidebarProps {
  program: Program;
}

export interface DetailSectionProps {
  id: string;
  title: string;
  children: ReactNode;
}

export interface DetailFactProps {
  label: string;
  children: ReactNode;
}

export interface DetailNumberedListProps {
  entries: string[];
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
