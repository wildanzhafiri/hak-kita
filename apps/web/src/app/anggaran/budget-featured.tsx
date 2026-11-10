import { ChartColumnIncreasing, Wallet } from 'lucide-react';
import { formatBudgetAmount, formatBudgetPercent } from './format-budget';
import type { BudgetFeaturedProps } from './types';

export function BudgetFeatured({
  allocation,
  realization,
  percentage,
  period,
  unit,
}: BudgetFeaturedProps) {
  return (
    <section
      aria-label="Gambaran umum anggaran"
      className="grid grid-cols-[minmax(0,.95fr)_minmax(0,1.05fr)] gap-4 rounded-[18px] border border-[#d8e8fa] bg-[#eaf3ff] p-[22px] max-[760px]:grid-cols-1 max-[760px]:p-3.5"
    >
      <article className="flex min-w-0 items-start gap-[18px] rounded-2xl border border-[#e5edf7] bg-white p-6 shadow-[0_5px_16px_rgba(28,65,105,.08)] max-[760px]:p-[18px] max-[400px]:flex-col max-[400px]:p-[15px]">
        <span
          aria-hidden="true"
          className="flex size-12 shrink-0 items-center justify-center rounded-[14px] bg-[#e0edff] text-[#1769c2] max-[760px]:size-[42px]"
        >
          <Wallet size={26} />
        </span>
        <div className="min-w-0">
          <h2 className="text-sm font-semibold text-[#344e6c]">Belanja yang direncanakan</h2>
          <p className="mt-2 break-words text-[clamp(28px,3vw,34px)] font-bold leading-[1.2] tracking-[-.035em] text-[#102c4a] tabular-nums">
            {formatBudgetAmount(allocation, unit, 1)}
          </p>
          <p className="mt-2 text-[13px] leading-[1.55] text-[#627b96]">
            Total belanja yang dialokasikan dalam anggaran tahun terpilih.
          </p>
        </div>
      </article>
      <article className="min-w-0 rounded-2xl border border-[#e5edf7] bg-[#f5f9ff] p-6 max-[760px]:p-[18px] max-[400px]:p-[15px]">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h2 className="flex items-center gap-3 text-sm font-semibold text-[#344e6c]">
            <span
              aria-hidden="true"
              className="flex size-[38px] shrink-0 items-center justify-center rounded-[11px] bg-[#e0edff] text-[#1769c2]"
            >
              <ChartColumnIncreasing size={22} />
            </span>
            Sudah direalisasikan
          </h2>
          <strong className="max-w-full break-words rounded-[14px] bg-[#dfedff] px-3.5 py-2 text-[clamp(19px,2vw,23px)] leading-tight tracking-[-.025em] text-[#1769c2] tabular-nums">
            {formatBudgetAmount(realization, unit, 1)}
          </strong>
        </div>
        <div
          aria-label={`${formatBudgetPercent(percentage)} dari pagu belanja telah terealisasi`}
          aria-valuemax={100}
          aria-valuemin={0}
          aria-valuenow={percentage}
          className="mt-5 h-3 overflow-hidden rounded-full bg-[#dce7f3]"
          role="meter"
        >
          <div
            className="h-full rounded-full bg-[#1769c2]"
            style={{ width: `${Math.min(percentage, 100)}%` }}
          />
        </div>
        <p className="mt-3 flex flex-wrap items-center gap-2 text-xs font-semibold leading-5 text-[#315677]">
          <strong className="rounded-full bg-[#deedff] px-2.5 py-1 text-[#164f8e]">
            {formatBudgetPercent(percentage)}
          </strong>
          <span>Realisasi sampai {period}</span>
        </p>
      </article>
    </section>
  );
}
