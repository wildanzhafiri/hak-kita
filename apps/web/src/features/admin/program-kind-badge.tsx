import { ADMIN_KIND_BADGE_CLASSES, ADMIN_KIND_LABELS } from './constants';
import type { ProgramKindBadgeProps } from './types';

export function ProgramKindBadge({ kind }: ProgramKindBadgeProps) {
  return (
    <span
      className={`inline-flex min-h-8 items-center whitespace-nowrap rounded-full border px-3 text-xs font-semibold ${ADMIN_KIND_BADGE_CLASSES[kind]}`}
    >
      {ADMIN_KIND_LABELS[kind]}
    </span>
  );
}
