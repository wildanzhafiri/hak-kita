import type { ValidationPreviewProps } from './types';

export function ValidationPreview({ rows }: ValidationPreviewProps) {
  return (
    <dl className="m-0">
      {rows.map((row) => (
        <div
          className="grid grid-cols-1 gap-1 border-b border-[#edf1f6] py-3.5 last:border-b-0 sm:grid-cols-[170px_minmax(0,1fr)] sm:gap-5"
          key={row.label}
        >
          <dt className="text-[13px] font-medium text-[#64748b]">{row.label}</dt>
          <dd className="m-0 min-w-0 text-sm leading-6 text-[#253044] [overflow-wrap:anywhere]">
            {row.values.length === 0 ? null : row.values.length === 1 ? (
              <span className="whitespace-pre-wrap">{row.values[0]}</span>
            ) : (
              <ul className="m-0 list-disc space-y-1 pl-[18px]">
                {row.values.map((value, index) => (
                  <li key={`${index}-${value}`}>{value}</li>
                ))}
              </ul>
            )}
          </dd>
        </div>
      ))}
    </dl>
  );
}
