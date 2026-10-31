import type { ReactNode } from 'react';
import type { Kategori, Program, Wilayah } from '@hakkita/schema';
import type { DETAIL_TABS } from './content';

export interface ProgramFilters {
  query: string;
  kategori: Kategori | null;
  provinsi: string | null;
  kabkota: string | null;
  kategoriOptions: Kategori[];
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
}

export interface ProgramListProps {
  programs: Program[];
  wilayah: Wilayah[];
  builtOn: string;
  initialQuery?: string;
  placeholder?: string;
}

export interface ProgramFilterBarProps {
  filters: ProgramFilters;
  placeholder: string;
}

export interface SearchResultsProps {
  programs: Program[];
  wilayah: Wilayah[];
  builtOn: string;
}

export interface ProgramDetailProps {
  program: Program;
  namaCakupan: string;
  builtOn: string;
}

export interface SummarySectionProps {
  program: Program;
  namaCakupan: string;
  today: string;
}

export interface RequirementsSectionProps {
  program: Program;
}

export interface StepsSectionProps {
  program: Program;
}

export interface DetailSidebarProps {
  program: Program;
  today: string;
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
