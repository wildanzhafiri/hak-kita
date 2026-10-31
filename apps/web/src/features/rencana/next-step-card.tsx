import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { OfficialSiteLink } from '@/components/program/official-site-link';
import { ProgressMeter } from '@/components/ui/progress-meter';
import { PROGRESS_NOTE } from './constants';
import { nextStepCopy } from './next-step-copy';
import type { NextStepCardProps } from './types';

export function NextStepCard({ step }: NextStepCardProps) {
  const { title, detail, action, readiness } = nextStepCopy(step);

  return (
    <section className="next-step" aria-labelledby="next-step-title">
      <p className="next-step-label">Langkah berikutnya</p>
      <h2 id="next-step-title">{title}</h2>
      <p>{detail}</p>
      {readiness && (
        <>
          <ProgressMeter
            value={readiness.ready}
            max={readiness.total}
            summary={`${readiness.ready} dari ${readiness.total} dokumen siap`}
            label="Kesiapan berkas berikutnya"
          />
          <p className="next-step-note">{PROGRESS_NOTE}</p>
        </>
      )}
      {action.external ? (
        <OfficialSiteLink url={action.href} className="button on-dark" />
      ) : (
        <Link className="button on-dark" href={action.href}>
          {action.label} <ArrowRight size={17} />
        </Link>
      )}
    </section>
  );
}
