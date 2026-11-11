import Link from 'next/link';
import { ArrowRight, UserCircle } from 'lucide-react';
import { ACCOUNT_GATE_COPY as COPY } from './content';
import type { AccountGateProps } from './types';

export function AccountGate({ title, next }: AccountGateProps) {
  const search = new URLSearchParams({ next });

  return (
    <div className="mx-auto flex max-w-[560px] flex-col items-center gap-4 rounded-2xl border border-[#e1e9f2] bg-[#f9fbfd] px-6 py-10 text-center">
      <UserCircle aria-hidden="true" className="text-[#196dcc]" size={40} />
      <h2 className="m-0 text-xl font-semibold text-[#253044]">{title}</h2>
      <p className="m-0 max-w-[44ch] text-sm leading-6 text-[#617087]">{COPY.description}</p>
      <div className="flex flex-wrap items-center justify-center gap-3">
        <Link className="button" href={`/masuk?${search.toString()}`}>
          {COPY.action}
          <ArrowRight aria-hidden="true" size={17} />
        </Link>
        <Link
          className="inline-flex items-center gap-2 text-sm font-semibold text-[#196dcc] hover:underline"
          href="/kenali-hakmu"
        >
          {COPY.explore}
        </Link>
      </div>
    </div>
  );
}
