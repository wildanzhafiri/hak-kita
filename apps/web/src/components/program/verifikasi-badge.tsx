import { VERIFIKASI_STYLE } from './constants';
import type { VerifikasiBadgeProps } from './types';

export function VerifikasiBadge({ tingkat }: VerifikasiBadgeProps) {
  const { label, icon: Icon } = VERIFIKASI_STYLE[tingkat];
  return (
    <span className={`verify ${tingkat}`}>
      <Icon size={14} />
      {label}
    </span>
  );
}
