import { ADMIN_CATEGORY_BADGE_CLASSES } from './constants';
import type { ProgramCategoryBadgeProps } from './types';

export function ProgramCategoryBadge({ category }: ProgramCategoryBadgeProps) {
  return (
    <span
      className={`inline-flex min-h-8 items-center whitespace-nowrap rounded-full border px-3 text-xs font-semibold ${ADMIN_CATEGORY_BADGE_CLASSES[category]}`}
    >
      {category}
    </span>
  );
}
