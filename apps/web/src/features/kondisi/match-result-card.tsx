import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';
import { programPath } from '@hakkita/domain';
import { PeriodChip } from '@/components/program/period-chip';
import { VerifikasiBadge } from '@/components/program/verifikasi-badge';
import type { MatchResultCardProps } from './types';

export function MatchResultCard({ result, today }: MatchResultCardProps) {
  const { program, status, reasons, checks, officialCheck } = result;
  return (
    <article className="condition-result panel">
      <div className="condition-result-top">
        <span className={`condition-status ${status}`}>
          {status === 'berpotensi-sesuai' ? 'Berpotensi sesuai' : 'Perlu dicek ke kanal resmi'}
        </span>
        <VerifikasiBadge tingkat={program.verifikasi} />
      </div>
      <h3>
        <Link href={programPath(program)}>{program.nama}</Link>
      </h3>
      <p>{program.ringkasan}</p>
      <PeriodChip program={program} today={today} />
      {reasons.length > 0 && (
        <div className="condition-evidence">
          <h4>Syarat yang dibandingkan</h4>
          <ol className="prose-list">
            {reasons.map((reason) => (
              <li key={reason.teks}>
                {reason.teks}{' '}
                {reason.sumberUrl && (
                  <a href={reason.sumberUrl} target="_blank" rel="noreferrer">
                    Lihat sumber
                  </a>
                )}
              </li>
            ))}
          </ol>
        </div>
      )}
      {checks.length > 0 && (
        <div className="condition-checks">
          <h4>Yang masih perlu diperiksa</h4>
          <ul className="prose-list">
            {checks.map((check) => (
              <li key={check}>{check}</li>
            ))}
          </ul>
        </div>
      )}
      <p className="condition-official-check">{officialCheck}</p>
      <div className="condition-result-actions">
        <Link className="text-link" href={programPath(program)}>
          Lihat rincian program
        </Link>
        <a className="text-link" href={program.sumberUtama.url} target="_blank" rel="noreferrer">
          Buka situs resmi <ArrowUpRight size={16} />
        </a>
      </div>
    </article>
  );
}
