import Link from 'next/link';
import { ArrowRight, MapPin } from 'lucide-react';
import { programPath, wilayahName } from '@hakkita/domain';
import { KATEGORI_STYLE } from './constants';
import { PeriodChip } from './period-chip';
import type { ProgramCardProps } from './types';
import { VerifikasiBadge } from './verifikasi-badge';

export function ProgramCard({ program, index, today }: ProgramCardProps) {
  const href = programPath(program);
  const { icon: Icon, tone } = KATEGORI_STYLE[program.kategori];
  return (
    <article className="program-card">
      <div className="card-top">
        <span className={`program-icon ${tone}`}>
          <Icon />
        </span>
      </div>
      <span className="category">{program.kategori}</span>
      <h3>
        <Link href={href}>{program.nama}</Link>
      </h3>
      <p>{program.ringkasan}</p>
      <div className="card-meta">
        <MapPin size={14} />
        {wilayahName(index, program.cakupan.kode)}
        <span className="tiny-dot" />
        <VerifikasiBadge tingkat={program.verifikasi} />
      </div>
      <div className="period-row">
        <PeriodChip program={program} today={today} />
      </div>
      <div className="card-foot">
        <Link className="text-link" href={href}>
          Lihat selengkapnya <ArrowRight size={17} />
        </Link>
      </div>
    </article>
  );
}
