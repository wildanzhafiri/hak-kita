'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { CircleAlert, CircleCheck, LoaderCircle, X } from 'lucide-react';
import { RADAR_INDICATOR_COPY } from './content';
import { formatElapsed, readRunTitle } from './radar-run-copy';
import { useOptionalRadarRunContext } from './radar-run-context';

export function RadarRunIndicator() {
  const pathname = usePathname();
  const run = useOptionalRadarRunContext();
  if (!run?.state || !pathname.startsWith('/admin') || pathname === '/admin/validasi') return null;

  const { state, elapsedSeconds, dismiss } = run;
  const isRunning = state.status === 'running';
  const Icon = isRunning ? LoaderCircle : state.status === 'done' ? CircleCheck : CircleAlert;

  return (
    <div
      className="fixed bottom-4 right-4 z-50 flex max-w-[calc(100vw-32px)] items-center gap-3 rounded-xl border border-[#c8d9eb] bg-white px-4 py-3 text-sm text-[#253044] shadow-[0_8px_24px_#25304426]"
      role="status"
    >
      <Icon
        aria-hidden="true"
        className={`shrink-0 text-[#196dcc] ${isRunning ? 'motion-safe:animate-spin' : ''}`}
        size={20}
      />
      <span className="min-w-0">
        <span className="block font-semibold">{readRunTitle(state)}</span>
        {isRunning && (
          <span className="block text-xs text-[#64748b]">
            {RADAR_INDICATOR_COPY.stillRunning(formatElapsed(elapsedSeconds))}
          </span>
        )}
      </span>
      <Link
        className="shrink-0 font-semibold text-[#1769c2] underline underline-offset-4"
        href="/admin/validasi"
      >
        {RADAR_INDICATOR_COPY.view}
      </Link>
      {!isRunning && (
        <button
          aria-label={RADAR_INDICATOR_COPY.dismiss}
          className="grid size-8 shrink-0 place-items-center rounded-lg text-[#64748b] hover:bg-[#edf5ff] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1769c2]"
          onClick={dismiss}
          type="button"
        >
          <X aria-hidden="true" size={16} />
        </button>
      )}
    </div>
  );
}
