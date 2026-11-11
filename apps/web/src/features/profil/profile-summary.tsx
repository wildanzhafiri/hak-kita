import type { ProfileSummaryProps } from './types';

export function ProfileSummary({ rows }: ProfileSummaryProps) {
  return (
    <dl className="m-0 mb-5 grid">
      {rows.map((row) => (
        <div
          className="grid grid-cols-1 gap-1 border-b border-[#e7ecf2] py-3 last:border-b-0 sm:grid-cols-[180px_minmax(0,1fr)] sm:gap-5"
          key={row.label}
        >
          <dt className="text-sm leading-6 text-[#64748b]">{row.label}</dt>
          <dd className="m-0 text-sm leading-[1.55] text-[#253044] [overflow-wrap:anywhere]">
            {row.value}
            {row.note && (
              <span className="mt-1 block text-[13px] leading-6 text-[#64748b]">{row.note}</span>
            )}
          </dd>
        </div>
      ))}
    </dl>
  );
}
