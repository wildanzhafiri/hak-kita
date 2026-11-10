export function formatBudgetAmount(
  value: number,
  unit: 'T' | 'M',
  digits = unit === 'T' ? 1 : 2,
): string {
  return `Rp${value.toLocaleString('id-ID', {
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  })} ${unit}`;
}

export function formatBudgetPercent(value: number, digits = 2): string {
  return `${value.toLocaleString('id-ID', {
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  })}%`;
}
