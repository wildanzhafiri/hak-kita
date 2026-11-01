import { ArrowUpRight } from 'lucide-react';
import type { BudgetCompositionChartProps } from './types';
import { ANGGARAN_CONTENT } from './content';

function formatAmount(value: number): string {
  return value.toLocaleString('id-ID', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

export function BudgetCompositionChart({
  year,
  period,
  dataReceived,
  composition,
}: BudgetCompositionChartProps) {
  const largestAllocation = Math.max(...composition.map((item) => item.allocation));

  return (
    <section
      aria-labelledby="composition-chart-title"
      className="rounded-[20px] border border-[#e1e6eb] bg-white p-8 max-[640px]:p-5"
    >
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h2
          className="text-[22px] font-bold leading-tight tracking-[-0.03em] text-[#292b2e]"
          id="composition-chart-title"
        >
          {ANGGARAN_CONTENT.compositionTitle} {year}
        </h2>
        <span className="text-[13px] text-[#718096]">{ANGGARAN_CONTENT.compositionUnit}</span>
      </div>

      <div aria-label="Keterangan grafik" className="mt-6 flex flex-wrap gap-x-6 gap-y-2 text-sm">
        <span className="inline-flex items-center gap-2 text-[#4d5968]">
          <span aria-hidden="true" className="size-3 rounded-[3px] bg-[#a8c9ef]" />
          Alokasi
        </span>
        <span className="inline-flex items-center gap-2 text-[#4d5968]">
          <span aria-hidden="true" className="size-3 rounded-[3px] bg-[#1c70ce]" />
          Realisasi
        </span>
      </div>

      <ol className="mt-7 grid gap-5">
        {composition.map((item) => (
          <li className="grid gap-2" key={item.label}>
            <h3 className="text-[15px] font-semibold text-[#526173]">{item.label}</h3>
            <div className="grid grid-cols-[minmax(0,1fr)_122px] items-center gap-x-4 gap-y-2 max-[480px]:grid-cols-[minmax(0,1fr)_96px] max-[380px]:grid-cols-1">
              <div
                aria-label={`Alokasi ${item.label}: ${formatAmount(item.allocation)} miliar rupiah`}
                aria-valuemax={largestAllocation}
                aria-valuemin={0}
                aria-valuenow={item.allocation}
                className="h-[13px] overflow-hidden rounded-[4px] bg-[#f0f3f7]"
                role="meter"
              >
                <div
                  className="h-full rounded-[4px] bg-[#a8c9ef]"
                  style={{ width: `${(item.allocation / largestAllocation) * 100}%` }}
                />
              </div>
              <span className="text-right text-[14px] tabular-nums text-[#718096] max-[380px]:text-left">
                {formatAmount(item.allocation)}
              </span>
              <div
                aria-label={`Realisasi ${item.label}: ${formatAmount(item.realization)} miliar rupiah`}
                aria-valuemax={largestAllocation}
                aria-valuemin={0}
                aria-valuenow={item.realization}
                className="h-[13px] overflow-hidden rounded-[4px] bg-[#f0f3f7]"
                role="meter"
              >
                <div
                  className="h-full rounded-[4px] bg-[#1c70ce]"
                  style={{ width: `${(item.realization / largestAllocation) * 100}%` }}
                />
              </div>
              <span className="text-right text-[14px] tabular-nums text-[#718096] max-[380px]:text-left">
                {formatAmount(item.realization)}
              </span>
            </div>
          </li>
        ))}
      </ol>

      <div className="mt-6 border-t border-[#dce2e8] pt-5">
        <a
          className="inline-flex min-h-8 items-center gap-2 text-[14px] font-medium text-[#2674ca] underline-offset-4 hover:underline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#196dcc]"
          href={ANGGARAN_CONTENT.apbdSourceUrl}
          rel="noreferrer"
          target="_blank"
        >
          {ANGGARAN_CONTENT.compositionSourceLabel}
          <ArrowUpRight aria-hidden="true" size={17} />
        </a>
        <p className="mt-2 text-[12px] leading-relaxed text-[#8390a0]">
          Data diterima SIKD per {dataReceived}. Realisasi APBD s.d. {period}. Grafik diperbarui
          otomatis setiap jam mengikuti data yang tersedia di sumber resmi.
        </p>
      </div>
    </section>
  );
}
