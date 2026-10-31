import { isLayanan } from '@hakkita/domain';
import { PeriodChip } from '@/components/program/period-chip';
import { GERBANG_LABEL } from './constants';
import { DetailFact } from './detail-fact';
import { DetailSection } from './detail-section';
import type { SummarySectionProps } from './types';

export function DetailSummarySection({ program, namaCakupan, today }: SummarySectionProps) {
  return (
    <DetailSection id="ringkasan" title="Ringkasan">
      <dl>
        <DetailFact label="Untuk siapa">{program.untuk.join(', ')}</DetailFact>
        <DetailFact label="Penyelenggara">{program.penyelenggara}</DetailFact>
        <DetailFact label="Cakupan wilayah">{namaCakupan}</DetailFact>
        <DetailFact label="Periode">
          <PeriodChip program={program} today={today} />
        </DetailFact>
        <DetailFact label={isLayanan(program) ? 'Jenis pengurusan' : 'Penentuan penerima'}>
          {GERBANG_LABEL[program.tipeGerbang]}
        </DetailFact>
      </dl>
      {program.catatan && (
        <p className="mt-[22px] border-l-[3px] border-[var(--border)] pl-[13px] text-[13px] leading-6 text-[var(--muted)]">
          {program.catatan}
        </p>
      )}
    </DetailSection>
  );
}
