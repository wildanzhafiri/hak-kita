import { BudgetAllocation } from './budget-allocation';
import { BudgetDetailTables } from './budget-detail-tables';
import { BudgetFeatured } from './budget-featured';
import { BudgetSources } from './budget-sources';
import { APBN_REVENUE, APBN_SECTORS, APBN_SOURCES, APBN_SPENDING } from './content';

export function BudgetOverview() {
  return (
    <>
      <BudgetFeatured
        allocation={3842.7}
        realization={2660.5}
        percentage={69.2}
        period="30 September 2026"
        unit="T"
      />
      <BudgetAllocation sectors={APBN_SECTORS} year={2026} />
      <BudgetDetailTables
        expenseTitle="Belanja Pemerintah Pusat dan Transfer ke Daerah"
        expenses={APBN_SPENDING}
        revenues={APBN_REVENUE}
        unit="T"
      />
      <BudgetSources
        note="Realisasi belanja dan pendapatan dalam APBN KiTa Oktober 2026. Pagu dan alokasi menurut fungsi mengikuti UU APBN 2026."
        sources={APBN_SOURCES}
      />
    </>
  );
}
