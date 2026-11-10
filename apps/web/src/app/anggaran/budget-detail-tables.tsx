'use client';

import { Accordion } from '@heroui/react';
import { ChevronDown } from 'lucide-react';
import { DataTable } from '@/components/ui/data-table';
import { formatBudgetAmount, formatBudgetPercent } from './format-budget';
import type { BudgetDetailRow, BudgetDetailTablesProps } from './types';

function createRows(rows: readonly BudgetDetailRow[], unit: 'T' | 'M') {
  return rows.map((row, index) => ({
    key: `${row.label}-${index}`,
    cells: [
      row.label,
      formatBudgetAmount(row.allocation, unit),
      formatBudgetAmount(row.realization, unit),
      formatBudgetPercent(
        row.realizationPercent ?? (row.allocation ? (row.realization / row.allocation) * 100 : 0),
      ),
    ],
  }));
}

export function BudgetDetailTables({
  expenses,
  revenues,
  expenseTitle,
  unit,
}: BudgetDetailTablesProps) {
  const items = [
    { id: 'belanja', title: expenseTitle, rows: expenses },
    { id: 'pendapatan', title: 'Rincian pendapatan', rows: revenues },
  ];

  return (
    <section aria-labelledby="budget-details-title" className="mt-12 min-w-0">
      <h2
        id="budget-details-title"
        className="mb-4 text-[clamp(19px,2vw,21px)] font-bold leading-[1.35] text-[#253044]"
      >
        Lihat Rincian Anggaran
      </h2>
      <Accordion className="grid min-w-0 gap-2" variant="default">
        {items.map((item) => (
          <Accordion.Item id={item.id} key={item.id}>
            <Accordion.Heading>
              <Accordion.Trigger className="flex min-h-[54px] w-full items-center justify-between gap-4 rounded-[10px] border border-[#e1e9f2] bg-[#f5f8fc] px-4 py-3 text-left text-[15px] font-semibold leading-[1.45] text-[#253044] hover:border-[#cbdced] hover:bg-[#edf5ff] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1769c2]">
                <span>{item.title}</span>
                <Accordion.Indicator className="group/indicator shrink-0 text-[#1769c2]">
                  <ChevronDown
                    aria-hidden="true"
                    className="transition-transform group-data-[expanded=true]/indicator:rotate-180 motion-reduce:transition-none"
                    size={18}
                  />
                </Accordion.Indicator>
              </Accordion.Trigger>
            </Accordion.Heading>
            <Accordion.Panel>
              <Accordion.Body>
                <div className="min-w-0 pt-2">
                  {item.rows.length > 0 ? (
                    <DataTable
                      columns={['Komponen', 'Anggaran', 'Realisasi', 'Realisasi (%)']}
                      rows={createRows(item.rows, unit)}
                    />
                  ) : (
                    <p className="px-4 py-5 text-sm text-[#617087]">
                      Rincian untuk bagian ini belum tersedia pada sumber data.
                    </p>
                  )}
                </div>
              </Accordion.Body>
            </Accordion.Panel>
          </Accordion.Item>
        ))}
      </Accordion>
    </section>
  );
}
