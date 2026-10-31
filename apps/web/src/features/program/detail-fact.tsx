import type { DetailFactProps } from './types';

export function DetailFact({ label, children }: DetailFactProps) {
  return (
    <div className="grid grid-cols-[170px_minmax(0,1fr)] gap-[18px] border-b border-[var(--border)] py-[13px] text-[13px] leading-[1.55] first:pt-1 last:border-b-0 last:pb-0 max-[700px]:grid-cols-[minmax(0,1fr)] max-[700px]:gap-[5px]">
      <dt className="text-[var(--muted)]">{label}</dt>
      <dd className="m-0 font-medium">{children}</dd>
    </div>
  );
}
