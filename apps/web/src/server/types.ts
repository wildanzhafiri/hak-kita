export interface DataIssue {
  path: PropertyKey[];
  message: string;
}

export interface ApbdBudgetCategory {
  label: string;
  allocation: number;
  realization: number;
}

export interface ApbdBudgetSnapshot {
  year: number;
  period: string;
  dataReceived: string;
  categories: ApbdBudgetCategory[];
}
