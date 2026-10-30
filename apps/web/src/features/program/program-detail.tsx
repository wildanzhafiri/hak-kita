'use client';

import { useState } from 'react';
import { VERIFIKASI_STYLE } from '@/components/program/constants';
import { DataNote } from '@/components/ui/data-note';
import { useToday } from '@/hooks/use-today';
import { DETAIL_TABS } from './constants';
import { DetailRequirementsTab } from './detail-requirements-tab';
import { DetailSidebar } from './detail-sidebar';
import { DetailStepsTab } from './detail-steps-tab';
import { DetailSummaryTab } from './detail-summary-tab';
import type { DetailTab, ProgramDetailProps } from './types';

const STEPS_TAB: DetailTab = 'Langkah berikutnya';

export function ProgramDetail({ program, namaCakupan, builtOn }: ProgramDetailProps) {
  const today = useToday(builtOn);
  const [tab, setTab] = useState<DetailTab>('Ringkasan');

  const verifiedLabel = VERIFIKASI_STYLE[program.verifikasi].label.toLowerCase();

  return (
    <>
      <DataNote>
        {program.verifikasi === 'belum'
          ? 'Entri ini belum diverifikasi ke sumber resmi. Periksa ketentuan, jadwal, dan ketersediaan melalui kanal resmi sebelum mengajukan.'
          : `Entri ini ${verifiedLabel}. Tetap periksa ketentuan terbaru melalui kanal resmi sebelum mengajukan.`}
      </DataNote>
      <div className="detail-layout">
        <div>
          <div className="tabs" role="tablist" aria-label="Informasi detail">
            {DETAIL_TABS.map((name) => (
              <button
                key={name}
                role="tab"
                aria-selected={tab === name}
                onClick={() => setTab(name)}
              >
                {name}
              </button>
            ))}
          </div>
          <section className="panel" role="tabpanel">
            {tab === 'Ringkasan' && (
              <DetailSummaryTab program={program} namaCakupan={namaCakupan} today={today} />
            )}
            {tab === 'Persyaratan' && <DetailRequirementsTab program={program} />}
            {tab === STEPS_TAB && <DetailStepsTab program={program} />}
          </section>
        </div>
        <DetailSidebar program={program} today={today} onShowSteps={() => setTab(STEPS_TAB)} />
      </div>
    </>
  );
}
