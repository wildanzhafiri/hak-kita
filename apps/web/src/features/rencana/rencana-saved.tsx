'use client';

import Link from 'next/link';
import { useState } from 'react';
import type { KeyboardEvent } from 'react';
import { ArrowLeft, ArrowRight, FileText, GraduationCap } from 'lucide-react';
import { programPath } from '@hakkita/domain';
import type { Program } from '@hakkita/schema';
import { Button } from '@/components/ui/button';
import { ButtonLink } from '@/components/ui/button-link';
import { ResultPagination } from '@/features/program/result-pagination';
import { useSavedIds } from '@/hooks/use-saved-ids';
import { SAVED_INFORMATION_PAGE_SIZE } from './constants';
import { SAVED_INFORMATION_TABS } from './content';
import { useRencanaState } from './rencana-context';
import { RencanaSavedCard } from './rencana-saved-card';
import { RencanaPreparation } from './rencana-preparation';
import type { RencanaSavedProps, SavedInformationKind } from './types';

export function RencanaSaved({ isEmailAvailable = false }: RencanaSavedProps) {
  const { saved, savedError, savedIsLoading, toggleSaved } = useRencanaState();
  const { retry } = useSavedIds();
  const [activeKind, setActiveKind] = useState<SavedInformationKind>('program');
  const [preparing, setPreparing] = useState<Program | null>(null);
  const [deferredPrograms, setDeferredPrograms] = useState<Program[]>([]);
  const [page, setPage] = useState(1);
  const visiblePrograms = [
    ...saved,
    ...deferredPrograms.filter(
      (program) => !saved.some((savedProgram) => savedProgram.id === program.id),
    ),
  ];
  const programs = visiblePrograms.filter(
    (program) => (program.jenis === 'layanan' ? 'layanan' : 'program') === activeKind,
  );
  const pageCount = Math.ceil(programs.length / SAVED_INFORMATION_PAGE_SIZE);
  const currentPage = Math.min(page, Math.max(pageCount, 1));
  const pagePrograms = programs.slice(
    (currentPage - 1) * SAVED_INFORMATION_PAGE_SIZE,
    currentPage * SAVED_INFORMATION_PAGE_SIZE,
  );
  const activeTab = SAVED_INFORMATION_TABS.find((tab) => tab.id === activeKind);

  function selectKind(kind: SavedInformationKind) {
    setActiveKind(kind);
    setPage(1);
  }

  function toggleProgramSaved(program: Program) {
    const isSaved = saved.some((savedProgram) => savedProgram.id === program.id);
    setDeferredPrograms((current) =>
      isSaved
        ? current.some((currentProgram) => currentProgram.id === program.id)
          ? current
          : [...current, program]
        : current.filter((currentProgram) => currentProgram.id !== program.id),
    );
    toggleSaved(program.id);
  }

  function moveTab(event: KeyboardEvent<HTMLButtonElement>, index: number) {
    if (!['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(event.key)) return;
    event.preventDefault();
    const nextIndex =
      event.key === 'Home'
        ? 0
        : event.key === 'End'
          ? SAVED_INFORMATION_TABS.length - 1
          : (index + (event.key === 'ArrowRight' ? 1 : -1) + SAVED_INFORMATION_TABS.length) %
            SAVED_INFORMATION_TABS.length;
    const nextTab = SAVED_INFORMATION_TABS[nextIndex];
    if (!nextTab) return;
    event.currentTarget.parentElement
      ?.querySelector<HTMLButtonElement>(`[data-tab-id="${nextTab.id}"]`)
      ?.focus();
    selectKind(nextTab.id);
  }

  if (preparing) {
    return (
      <section aria-label={`Persiapan ${preparing.nama}`}>
        <RencanaPreparation isEmailAvailable={isEmailAvailable} program={preparing} />
        <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <Button
            className="order-2 w-fit self-center !px-0 sm:order-1 sm:self-auto"
            tone="quiet"
            onPress={() => setPreparing(null)}
          >
            <ArrowLeft aria-hidden="true" size={20} /> Kembali ke Rencanaku
          </Button>
          <ButtonLink
            className="order-1 w-full !min-h-12 !gap-2 !rounded-lg !px-4 !py-2 !text-sm sm:order-2 sm:w-auto sm:!min-h-11 sm:!px-4 sm:!text-xs"
            href={programPath(preparing)}
            icon={<ArrowRight aria-hidden="true" size={18} />}
          >
            {preparing.jenis === 'layanan' ? 'Lihat detail layanan' : 'Lihat detail program'}
          </ButtonLink>
        </div>
      </section>
    );
  }

  return (
    <section aria-label="Simpanan Rencanaku">
      {savedError && (
        <div
          className="mb-5 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-[#f0c7c9] bg-[#fff5f5] p-4 text-sm text-[#a72b32]"
          role="alert"
        >
          <span>{savedError}</span>
          <Button className="!min-h-9 !px-3 !text-sm" tone="secondary" onPress={() => void retry()}>
            Coba lagi
          </Button>
        </div>
      )}
      {savedIsLoading ? (
        <div aria-busy="true" className="mt-7" role="status" aria-label="Memuat simpanan">
          <span className="sr-only">Memuat program dan layanan tersimpan</span>
          <div aria-hidden="true" className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {SAVED_INFORMATION_TABS.map((tab) => (
              <article
                className="flex min-h-[260px] min-w-0 flex-col rounded-xl border border-[#dbe5ef] bg-white p-5 sm:p-6"
                key={tab.id}
              >
                <div className="flex items-center justify-between gap-4">
                  <span className="h-5 w-2/3 rounded bg-[#e9eff6] motion-safe:animate-pulse motion-reduce:animate-none" />
                  <span className="size-5 rounded bg-[#e9eff6] motion-safe:animate-pulse motion-reduce:animate-none" />
                </div>
                <div className="mt-6 space-y-2">
                  <span className="block h-3 w-full rounded bg-[#e9eff6] motion-safe:animate-pulse motion-reduce:animate-none" />
                  <span className="block h-3 w-4/5 rounded bg-[#e9eff6] motion-safe:animate-pulse motion-reduce:animate-none" />
                </div>
                <div className="mt-8 h-3 w-1/3 rounded bg-[#e9eff6] motion-safe:animate-pulse motion-reduce:animate-none" />
                <div className="mt-3 h-1.5 rounded-full bg-[#e9eff6] motion-safe:animate-pulse motion-reduce:animate-none" />
                <div className="mt-5 h-3 w-1/2 rounded bg-[#e9eff6] motion-safe:animate-pulse motion-reduce:animate-none" />
                <div className="mt-auto border-t border-[#e7ecf2] pt-5">
                  <div className="h-4 w-1/4 rounded bg-[#e9eff6] motion-safe:animate-pulse motion-reduce:animate-none" />
                </div>
              </article>
            ))}
          </div>
        </div>
      ) : (
        <>
          <div
            className="mb-6 mt-7 flex w-fit max-w-full gap-2 border-b border-[#e1e7ee]"
            role="group"
            aria-label="Jenis simpanan"
          >
            {SAVED_INFORMATION_TABS.map((tab, index) => {
              const count = saved.filter(
                (program) => (program.jenis === 'layanan' ? 'layanan' : 'program') === tab.id,
              ).length;
              const isActive = activeKind === tab.id;
              return (
                <Button
                  aria-pressed={isActive}
                  className={`!min-h-11 !rounded-none !px-4 !text-sm !font-medium ${isActive ? '!border-b-[3px] !border-[#196dcc] !text-[#196dcc]' : '!border-b-[3px] !border-transparent !text-[#526173]'}`}
                  data-tab-id={tab.id}
                  key={tab.id}
                  tone="quiet"
                  onKeyDown={(event) => moveTab(event, index)}
                  onPress={() => selectKind(tab.id)}
                >
                  {tab.label}
                  <span
                    className={`rounded-full px-2 py-0.5 text-xs ${isActive ? 'bg-[#edf5ff] text-[#196dcc]' : 'bg-[#f0f4f8] text-[#617087]'}`}
                  >
                    {count}
                  </span>
                </Button>
              );
            })}
          </div>
          <div aria-live="polite">
            {programs.length === 0 && !savedError && activeTab && (
              <div className="mx-auto grid max-w-[520px] justify-items-center py-10 text-center">
                <span className="mb-4 grid size-16 place-items-center rounded-2xl bg-[#edf5ff] text-[#196dcc]">
                  {activeKind === 'program' ? (
                    <GraduationCap aria-hidden="true" size={30} />
                  ) : (
                    <FileText aria-hidden="true" size={30} />
                  )}
                </span>
                <h3 className="m-0 text-lg font-semibold text-[#1b304c]">{activeTab.emptyTitle}</h3>
                <p className="mb-0 mt-2 max-w-[440px] text-sm leading-6 text-[#617087]">
                  {activeTab.emptyDescription}
                </p>
                <Link
                  className="mt-5 inline-flex min-h-11 items-center justify-center rounded-lg bg-[#196dcc] px-5 text-sm font-semibold text-white hover:bg-[#1458a3] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#196dcc]"
                  href={activeTab.browseHref}
                >
                  {activeTab.browseLabel}
                </Link>
              </div>
            )}
            {pagePrograms.length > 0 && (
              <div className="grid grid-cols-1 items-stretch gap-4 md:grid-cols-2">
                {pagePrograms.map((program) => (
                  <RencanaSavedCard
                    isSaved={saved.some((savedProgram) => savedProgram.id === program.id)}
                    key={program.id}
                    onPrepare={setPreparing}
                    onToggleSaved={toggleProgramSaved}
                    program={program}
                  />
                ))}
              </div>
            )}
            <ResultPagination
              ariaLabel="Halaman simpanan"
              page={currentPage}
              pageCount={pageCount}
              onPageChange={setPage}
            />
          </div>
        </>
      )}
    </section>
  );
}
