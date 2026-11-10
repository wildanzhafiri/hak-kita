import type { ApbdBudgetFilters, ApbdBudgetSnapshot, BudgetOption } from '@/server/types';

export interface BudgetSector {
  id: string;
  label: string;
  allocation: number;
  icon:
    | 'economy'
    | 'public'
    | 'education'
    | 'defense'
    | 'social'
    | 'security'
    | 'health'
    | 'housing'
    | 'religion'
    | 'environment'
    | 'tourism';
  purpose: string;
}

export interface BudgetSource {
  label: string;
  url: string;
  note: string;
}

export interface BudgetFeaturedProps {
  allocation: number;
  realization: number;
  percentage: number;
  period: string;
  unit: 'T' | 'M';
}

export interface BudgetAllocationProps {
  sectors: readonly BudgetSector[];
  year: number;
}

export interface BudgetFiltersProps {
  filters: ApbdBudgetFilters;
  selectedYear: number;
  selectedProvince: string;
  selectedRegion: string;
}

export interface BudgetApbnFiltersProps {
  year: number;
}

export interface BudgetFilterFieldProps {
  label: string;
  placeholder?: string;
  value: string;
  options: readonly BudgetOption[];
  isDisabled?: boolean;
  onChange: (value: string) => void;
}

export interface BudgetDetailRow {
  label: string;
  allocation: number;
  realization: number;
  realizationPercent?: number;
}

export interface BudgetDetailTablesProps {
  expenses: readonly BudgetDetailRow[];
  revenues: readonly BudgetDetailRow[];
  expenseTitle: string;
  unit: 'T' | 'M';
}

export interface BudgetSourcesProps {
  sources: readonly BudgetSource[];
  note: string;
}

export interface ApbdBudgetOverviewProps {
  snapshot: ApbdBudgetSnapshot;
}
