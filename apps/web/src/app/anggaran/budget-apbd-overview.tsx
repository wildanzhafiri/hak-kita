import { BudgetDetailTables } from './budget-detail-tables';
import { BudgetFeatured } from './budget-featured';
import { BudgetSources } from './budget-sources';
import type { ApbdBudgetOverviewProps } from './types';

export function ApbdBudgetOverview({ snapshot }: ApbdBudgetOverviewProps) {
  return (
    <>
      <BudgetFeatured
        allocation={snapshot.totalAllocation}
        realization={snapshot.totalRealization}
        percentage={snapshot.realizationPercent}
        period={snapshot.period}
        unit="M"
      />
      <section aria-labelledby="budget-apbd-allocation-title" className="mt-10">
        <h2
          id="budget-apbd-allocation-title"
          className="text-[clamp(20px,2vw,22px)] font-bold leading-[1.3] text-[#253044]"
        >
          Ke Mana Anggaran Dialokasikan?
        </h2>
        <p className="mt-2 text-sm leading-[1.6] text-[#697a8e]">
          Rincian anggaran menurut bidang belum tersedia pada data SIKD untuk {snapshot.regionLabel}
          .
        </p>
        <div className="mt-5 rounded-xl border border-[#dce8f5] bg-[#f5f8fc] px-5 py-4 text-sm leading-[1.6] text-[#475569]">
          Data APBD yang tersedia dikelompokkan menurut jenis belanja. Jenis belanja tidak
          menunjukkan bidang seperti pendidikan atau kesehatan.
        </div>
      </section>
      <BudgetDetailTables
        expenseTitle="Rincian belanja daerah"
        expenses={snapshot.expenses}
        revenues={snapshot.revenues}
        unit="M"
      />
      <BudgetSources
        note={`APBD ${snapshot.regionLabel} ${snapshot.year}. Realisasi sampai ${snapshot.period}; data diterima SIKD per ${snapshot.dataReceived}.`}
        sources={[
          {
            label: 'Portal Data SIKD, DJPK Kementerian Keuangan',
            url: snapshot.sourceUrl,
            note: `Rincian resmi untuk ${snapshot.regionLabel}.`,
          },
        ]}
      />
    </>
  );
}
