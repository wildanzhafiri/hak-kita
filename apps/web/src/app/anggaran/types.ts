export interface BudgetMetric {
  label: string;
  value: string;
  detail: string;
}

export interface BudgetCompositionItem {
  label: string;
  allocation: number;
  realization: number;
}

export interface BudgetOverviewProps {
  metrics: readonly BudgetMetric[];
  year: number;
  period: string;
  dataReceived: string;
  composition: readonly BudgetCompositionItem[];
}

export interface BudgetCompositionChartProps {
  year: number;
  period: string;
  dataReceived: string;
  composition: readonly BudgetCompositionItem[];
}
