import Link from 'next/link';
import { ArrowRight, ShieldCheck } from 'lucide-react';
import { PageShell } from '@/components/layout/page-shell';
import { RENCANA_GATE_COPY as COPY } from './content';

export function RencanaGuestGate() {
  return (
    <PageShell
      breadcrumbs={[{ label: COPY.breadcrumb }]}
      description={COPY.description}
      title={COPY.title}
    >
      <div className="mx-auto flex max-w-[560px] flex-col items-center gap-4 py-8 text-center">
        <span
          aria-hidden="true"
          className="grid size-20 place-items-center rounded-[20px] bg-[#edf5ff] text-[#1769c2]"
        >
          <ShieldCheck size={40} />
        </span>
        <h2 className="m-0 mt-2 text-[22px] font-semibold capitalize leading-[1.3] tracking-[-0.025em] text-[#253044]">
          {COPY.gateTitle}
        </h2>
        <p className="m-0 max-w-[480px] text-base leading-[1.65] text-[#435570]">
          {COPY.gateDescription}
        </p>
        <div className="mt-3 flex flex-wrap items-center justify-center gap-3">
          <Link className="button" href="/masuk?next=%2Frencanaku">
            {COPY.signIn}
            <ArrowRight aria-hidden="true" size={18} />
          </Link>
          <Link className="button secondary" href="/kenali-hakmu">
            {COPY.explore}
          </Link>
        </div>
      </div>
    </PageShell>
  );
}
