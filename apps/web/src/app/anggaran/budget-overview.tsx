import { ArrowUpRight, Info } from 'lucide-react';
import { BudgetCompositionChart } from './budget-composition-chart';
import { ANGGARAN_CONTENT } from './content';
import type { BudgetOverviewProps } from './types';

export function BudgetOverview({
  metrics,
  year,
  period,
  dataReceived,
  composition,
}: BudgetOverviewProps) {
  return (
    <div className="grid gap-10">
      <section aria-labelledby="apbn-title">
        <div className="mb-5 flex flex-wrap items-end justify-between gap-4">
          <div>
            <h2
              className="text-[25px] font-bold leading-tight tracking-[-0.03em] text-[#292b2e]"
              id="apbn-title"
            >
              {ANGGARAN_CONTENT.sectionTitle}
            </h2>
            <p className="mt-2 text-[14px] text-[#68717d]">{ANGGARAN_CONTENT.reportingPeriod}</p>
          </div>
          <span className="text-[12px] text-[#68717d]">{ANGGARAN_CONTENT.checkedDate}</span>
        </div>
        <div className="grid grid-cols-2 gap-4 max-[640px]:grid-cols-1">
          {metrics.map((metric, index) => (
            <article
              className={`rounded-xl border border-[#dce1e6] p-6 max-[640px]:p-5 ${index === 1 ? 'bg-[#f0f6fd]' : 'bg-white'}`}
              key={metric.label}
            >
              <h3 className="text-[14px] font-medium text-[#68717d]">{metric.label}</h3>
              <p className="mt-4 text-[clamp(25px,3vw,34px)] font-bold leading-tight tracking-[-0.04em] text-[#292b2e]">
                {metric.value}
              </p>
              <p className="mt-2 text-[13px] text-[#68717d]">{metric.detail}</p>
            </article>
          ))}
        </div>
        <a
          className="mt-4 inline-flex min-h-11 items-center gap-2 text-[13px] font-semibold text-[#196dcc] underline-offset-4 hover:underline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#196dcc]"
          href={ANGGARAN_CONTENT.apbnSourceUrl}
          rel="noreferrer"
          target="_blank"
        >
          {ANGGARAN_CONTENT.apbnSourceLabel}
          <ArrowUpRight aria-hidden="true" size={17} />
        </a>
      </section>

      <BudgetCompositionChart
        year={year}
        period={period}
        dataReceived={dataReceived}
        composition={composition}
      />

      <section
        aria-labelledby="apbd-title"
        className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-8 rounded-xl border border-[#d8e4f2] bg-[#f0f6fd] px-8 py-7 max-[700px]:grid-cols-1 max-[700px]:gap-5 max-[700px]:px-6 max-[700px]:py-6"
      >
        <div>
          <h2
            className="text-[22px] font-bold leading-tight tracking-[-0.03em] text-[#292b2e]"
            id="apbd-title"
          >
            {ANGGARAN_CONTENT.apbdTitle}
          </h2>
          <p className="mt-2 max-w-[680px] text-[14px] leading-[1.65] text-[#68717d]">
            {ANGGARAN_CONTENT.apbdDescription}
          </p>
          <p className="mt-3 text-[12px] text-[#68717d]">{ANGGARAN_CONTENT.apbdSourceLabel}</p>
        </div>
        <a
          className="inline-flex min-h-11 items-center justify-center gap-2 rounded-lg bg-[#196dcc] px-5 text-[13px] font-semibold text-white transition-colors hover:bg-[#1458a3] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#196dcc] motion-reduce:transition-none max-[700px]:w-full"
          href={ANGGARAN_CONTENT.apbdSourceUrl}
          rel="noreferrer"
          target="_blank"
        >
          Buka data APBD
          <ArrowUpRight aria-hidden="true" size={17} />
        </a>
      </section>

      <aside className="flex items-start gap-3 rounded-lg border border-[#e6dfc9] bg-[#faf8f0] px-5 py-4 text-[13px] leading-[1.65] text-[#755d2f]">
        <Info aria-hidden="true" className="mt-0.5 shrink-0" size={17} />
        <p>{ANGGARAN_CONTENT.readingNote}</p>
      </aside>
    </div>
  );
}
