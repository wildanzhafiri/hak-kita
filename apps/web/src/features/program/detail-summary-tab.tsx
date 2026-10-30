import { isLayanan } from '@hakkita/domain';
import { PeriodChip } from '@/components/program/period-chip';
import { GERBANG_LABEL } from './constants';
import type { SummaryTabProps } from './types';

export function DetailSummaryTab({ program, namaCakupan, today }: SummaryTabProps) {
  return (
    <>
      <h2>
        {isLayanan(program) ? 'Pengurusan yang lebih terarah.' : 'Kesempatan untuk melangkah maju.'}
      </h2>
      <p>{program.ringkasan}</p>
      <h3>Untuk siapa</h3>
      <ul className="prose-list">
        {program.untuk.map((target) => (
          <li key={target}>{target}</li>
        ))}
      </ul>
      <dl className="details-list">
        <div>
          <dt>Penyelenggara</dt>
          <dd>{program.penyelenggara}</dd>
        </div>
        <div>
          <dt>Cakupan wilayah</dt>
          <dd>{namaCakupan}</dd>
        </div>
        <div>
          <dt>Periode</dt>
          <dd>
            <PeriodChip program={program} today={today} />
          </dd>
        </div>
        <div>
          <dt>Cara kelayakan ditentukan</dt>
          <dd>{GERBANG_LABEL[program.tipeGerbang]}</dd>
        </div>
      </dl>
      {program.catatan && <p className="small-note">{program.catatan}</p>}
    </>
  );
}
