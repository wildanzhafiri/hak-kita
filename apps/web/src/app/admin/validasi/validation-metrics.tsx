import { VALIDATION_COPY } from './content';
import type { ValidationMetricsProps } from './types';

export function ValidationMetrics({ items }: ValidationMetricsProps) {
  const metrics = [
    { label: VALIDATION_COPY.metrics.total, value: items.length },
    {
      label: VALIDATION_COPY.metrics.created,
      value: items.filter((item) => item.finding === 'new').length,
    },
    {
      label: VALIDATION_COPY.metrics.updates,
      value: items.filter((item) => item.finding === 'update').length,
    },
  ];

  return (
    <dl className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
      {metrics.map((metric) => (
        <div
          className="rounded-xl border border-[#e1e9f2] bg-white px-5 py-[18px]"
          key={metric.label}
        >
          <dt className="text-[13px] text-[#64748b]">{metric.label}</dt>
          <dd className="m-0 mt-1.5 text-[28px] font-semibold leading-[1.3] text-[#253044]">
            {metric.value}
          </dd>
        </div>
      ))}
    </dl>
  );
}
