'use client';

import { useState } from 'react';
import { VERIFIKASI_STYLE } from '@/components/program/constants';
import { DataNote } from '@/components/ui/data-note';
import { useToday } from '@/hooks/use-today';
import { DetailRequirementsSection } from './detail-requirements-section';
import { DetailSidebar } from './detail-sidebar';
import { DetailStepsSection } from './detail-steps-section';
import { DetailSummarySection } from './detail-summary-section';
import { DetailTabPanel } from './detail-tab-panel';
import { DetailTabs } from './detail-tabs';
import type { DetailTab, ProgramDetailProps } from './types';

export function ProgramDetail({ program, namaCakupan, builtOn }: ProgramDetailProps) {
  const today = useToday(builtOn);
  const [activeTab, setActiveTab] = useState<DetailTab>('ringkasan');
  const verifiedLabel = VERIFIKASI_STYLE[program.verifikasi].label.toLowerCase();

  return (
    <>
      <DataNote>
        {program.verifikasi === 'belum'
          ? 'Entri ini belum diverifikasi ke sumber resmi. Periksa ketentuan, jadwal, dan ketersediaan melalui kanal resmi sebelum mengajukan.'
          : `Entri ini ${verifiedLabel}. Tetap periksa ketentuan terbaru melalui kanal resmi sebelum mengajukan.`}
      </DataNote>
      <DetailTabs activeTab={activeTab} onSelect={setActiveTab} />
      <div className="grid items-start gap-6 lg:grid-cols-[minmax(0,1fr)_300px]">
        <div className="min-w-0">
          <DetailTabPanel id="ringkasan" isActive={activeTab === 'ringkasan'}>
            <DetailSummarySection program={program} namaCakupan={namaCakupan} today={today} />
          </DetailTabPanel>
          <DetailTabPanel id="persyaratan" isActive={activeTab === 'persyaratan'}>
            <DetailRequirementsSection program={program} />
          </DetailTabPanel>
          <DetailTabPanel id="langkah" isActive={activeTab === 'langkah'}>
            <DetailStepsSection program={program} />
          </DetailTabPanel>
        </div>
        <DetailSidebar program={program} today={today} />
      </div>
    </>
  );
}
