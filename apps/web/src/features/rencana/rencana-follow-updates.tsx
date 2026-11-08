'use client';

import Link from 'next/link';
import { Bell } from 'lucide-react';
import { getProgramChanges, programPath } from '@hakkita/domain';
import { Button } from '@/components/ui/button';
import { useProgramFollows } from '@/hooks/use-program-follows';
import { FOLLOW_CHANGE_LABELS, FOLLOW_UPDATES_CONTENT } from './content';
import { RencanaEmailPreference } from './rencana-email-preference';
import { useRencanaState } from './rencana-context';
import type { RencanaFollowUpdatesProps } from './types';

export function RencanaFollowUpdates({ programs, isEmailAvailable }: RencanaFollowUpdatesProps) {
  const { rows, isLoading, busyProgramId, error, isSignedIn, unfollow, markSeen, retry } =
    useProgramFollows();
  const { today } = useRencanaState();
  if (!isSignedIn) return null;

  return (
    <section
      className="rounded-2xl border border-[#dbe5ef] bg-white p-5 sm:p-6"
      aria-labelledby="follow-updates-title"
    >
      <div className="flex items-start gap-3">
        <span className="grid size-10 shrink-0 place-items-center rounded-lg bg-[#edf5ff] text-[#196dcc]">
          <Bell aria-hidden="true" size={20} />
        </span>
        <div>
          <h2 id="follow-updates-title" className="m-0 text-xl font-semibold text-[#1b304c]">
            {FOLLOW_UPDATES_CONTENT.title}
          </h2>
          <p className="mt-1 text-sm leading-6 text-[#617087]">{FOLLOW_UPDATES_CONTENT.intro}</p>
        </div>
      </div>
      {isLoading ? (
        <p className="mt-5 text-sm text-[#617087]">Memuat program yang diikuti</p>
      ) : null}
      {error && (
        <div role="alert" className="mt-4 flex flex-wrap items-center gap-2 text-sm text-[#b72f35]">
          <span>{error}</span>
          <Button tone="quiet" className="min-h-8 px-1 text-sm" onPress={retry}>
            {FOLLOW_UPDATES_CONTENT.retry}
          </Button>
        </div>
      )}
      {!isLoading && !error && rows.length === 0 && (
        <p className="mt-5 text-sm leading-6 text-[#617087]">{FOLLOW_UPDATES_CONTENT.empty}</p>
      )}
      {rows.length > 0 && (
        <ul className="mt-5 grid gap-3">
          {rows.map((row) => {
            const program = programs.find((entry) => entry.id === row.program_id);
            const changes = program ? getProgramChanges(row.snapshot, program, today) : [];
            const isBusy = busyProgramId === row.program_id;
            return (
              <li key={row.program_id} className="rounded-xl border border-[#dbe5ef] p-4">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div className="min-w-0">
                    {program ? (
                      <Link
                        className="font-semibold text-[#196dcc] hover:underline"
                        href={programPath(program)}
                      >
                        {program.nama}
                      </Link>
                    ) : (
                      <strong className="text-[#1b304c]">{row.program_id}</strong>
                    )}
                    {changes.length > 0 ? (
                      <ul className="mt-2 list-disc pl-5 text-sm leading-6 text-[#25354b]">
                        {changes.map((change) => (
                          <li key={change}>{FOLLOW_CHANGE_LABELS[change]}</li>
                        ))}
                      </ul>
                    ) : (
                      <p className="mt-2 text-sm text-[#617087]">
                        {program
                          ? FOLLOW_UPDATES_CONTENT.noChanges
                          : FOLLOW_UPDATES_CONTENT.unknown}
                      </p>
                    )}
                  </div>
                  {changes.length > 0 && (
                    <span className="rounded-full bg-[#edf5ff] px-3 py-1 text-xs font-semibold text-[#196dcc]">
                      Baru
                    </span>
                  )}
                </div>
                <div className="mt-3 flex flex-wrap items-center gap-2 border-t border-[#e1e7ee] pt-3">
                  {changes.length > 0 && program && (
                    <>
                      <a
                        className="text-sm font-medium text-[#196dcc] hover:underline"
                        href={program.sumberUtama.url}
                        target="_blank"
                        rel="noreferrer"
                      >
                        {FOLLOW_UPDATES_CONTENT.source}
                      </a>
                      <Button
                        tone="quiet"
                        className="min-h-8 px-2 text-sm"
                        isDisabled={isBusy}
                        onPress={() => void markSeen(program)}
                      >
                        {FOLLOW_UPDATES_CONTENT.seen}
                      </Button>
                    </>
                  )}
                  <Button
                    tone="quiet"
                    className="min-h-8 px-2 text-sm"
                    isDisabled={isBusy}
                    onPress={() => void unfollow(row.program_id)}
                  >
                    {FOLLOW_UPDATES_CONTENT.stop}
                  </Button>
                </div>
              </li>
            );
          })}
        </ul>
      )}
      {isEmailAvailable && <RencanaEmailPreference />}
    </section>
  );
}
