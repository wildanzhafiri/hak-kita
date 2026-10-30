import { Clock } from 'lucide-react';
import { periodLabel, periodStatus } from '@hakkita/domain';
import type { PeriodChipProps } from './types';

export function PeriodChip({ program, today }: PeriodChipProps) {
  const status = periodStatus(program.periode, today);
  return (
    <span className={`period-chip ${status}`}>
      <Clock size={13} />
      {periodLabel(program.periode, status)}
    </span>
  );
}
