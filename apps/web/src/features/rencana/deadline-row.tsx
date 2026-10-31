import Link from 'next/link';
import { periodLabel, programPath } from '@hakkita/domain';
import { URGENT_DAYS } from './constants';
import { deadlineCaption } from './deadline-caption';
import type { DeadlineRowProps } from './types';

export function DeadlineRow({ deadline }: DeadlineRowProps) {
  const { program, status, daysLeft } = deadline;
  const urgent = daysLeft !== null && daysLeft <= URGENT_DAYS;

  return (
    <li className={`deadline-row ${status}${urgent ? ' urgent' : ''}`}>
      <div>
        <Link href={programPath(program)}>{program.nama}</Link>
        <span className="when">{periodLabel(program.periode, status)}</span>
      </div>
      <strong>{deadlineCaption(deadline)}</strong>
    </li>
  );
}
