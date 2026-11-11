import Link from 'next/link';
import { ArrowUpRight, ExternalLink } from 'lucide-react';
import { isLayanan, programPath } from '@hakkita/domain';
import { VerifikasiBadge } from '@/components/program/verifikasi-badge';
import { PROGRAM_DETAIL_COPY } from './content';
import type { ProgramDetailContentProps } from './types';

function formatDate(value: string | undefined) {
  if (!value) return PROGRAM_DETAIL_COPY.noDate;
  return new Intl.DateTimeFormat('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    timeZone: 'UTC',
  }).format(new Date(`${value}T00:00:00Z`));
}

function formatPeriod(period: NonNullable<ProgramDetailContentProps['program']['periode']>) {
  if (period === 'sepanjang-tahun') return PROGRAM_DETAIL_COPY.yearRound;
  return PROGRAM_DETAIL_COPY.dateRange(formatDate(period.buka), formatDate(period.tutup));
}

export function ProgramDetailContent({ program }: ProgramDetailContentProps) {
  const title = isLayanan(program) ? PROGRAM_DETAIL_COPY.service : PROGRAM_DETAIL_COPY.program;

  return (
    <article className="overflow-hidden rounded-xl border border-[#e1e9f2] bg-white">
      <header className="border-b border-[#e1e9f2] p-5 sm:p-7">
        <div className="flex flex-wrap items-center gap-2 text-xs font-semibold uppercase tracking-[0.08em] text-[#64748b]">
          <span>{title}</span>
          <span aria-hidden="true">Â·</span>
          <span>{program.kategori}</span>
        </div>
        <div className="mt-3 flex flex-wrap items-start justify-between gap-4">
          <div className="max-w-3xl">
            <h1 className="text-2xl font-semibold leading-tight tracking-[-0.025em] text-[#253044] sm:text-3xl">
              {program.nama}
            </h1>
            <p className="mt-2 text-base text-[#64748b]">{program.penyelenggara}</p>
          </div>
          <VerifikasiBadge tingkat={program.verifikasi} />
        </div>
      </header>

      <div className="[display:grid] gap-6 p-5 sm:p-7 lg:grid-cols-[minmax(0,1fr)_300px]">
        <div className="space-y-7">
          <section>
            <h2 className="text-base font-semibold text-[#253044]">
              {PROGRAM_DETAIL_COPY.summary}
            </h2>
            <p className="mt-2 text-sm leading-7 text-[#475569]">{program.ringkasan}</p>
          </section>

          <section>
            <h2 className="text-base font-semibold text-[#253044]">
              {PROGRAM_DETAIL_COPY.requirements}
            </h2>
            <ul className="mt-3 flex flex-col gap-3">
              {program.syarat.map((requirement, index) => (
                <li
                  className="rounded-lg border border-[#e8eef5] bg-[#fbfcfe] p-4"
                  key={`${requirement.teks}-${index}`}
                >
                  <p className="text-sm leading-6 text-[#475569]">{requirement.teks}</p>
                  {requirement.sumberUrl && (
                    <a
                      className="mt-2 inline-flex min-h-9 items-center gap-1.5 text-sm font-semibold text-[#1769c2] underline-offset-4 hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1769c2]"
                      href={requirement.sumberUrl}
                      rel="noreferrer"
                      target="_blank"
                    >
                      Sumber persyaratan <ExternalLink aria-hidden="true" size={14} />
                    </a>
                  )}
                </li>
              ))}
            </ul>
          </section>

          <section className="[display:grid] gap-6 sm:grid-cols-2">
            <div>
              <h2 className="text-base font-semibold text-[#253044]">
                {PROGRAM_DETAIL_COPY.steps}
              </h2>
              {program.langkah.length ? (
                <ol className="mt-3 list-decimal space-y-2 pl-5 text-sm leading-6 text-[#475569]">
                  {program.langkah.map((step, index) => (
                    <li key={`${step}-${index}`}>{step}</li>
                  ))}
                </ol>
              ) : (
                <p className="mt-2 text-sm leading-6 text-[#64748b]">
                  {PROGRAM_DETAIL_COPY.noSteps}
                </p>
              )}
            </div>
            <div>
              <h2 className="text-base font-semibold text-[#253044]">
                {PROGRAM_DETAIL_COPY.documents}
              </h2>
              {program.dokumen.length ? (
                <ul className="mt-3 list-disc space-y-2 pl-5 text-sm leading-6 text-[#475569]">
                  {program.dokumen.map((document, index) => (
                    <li key={`${document}-${index}`}>{document}</li>
                  ))}
                </ul>
              ) : (
                <p className="mt-2 text-sm leading-6 text-[#64748b]">
                  {PROGRAM_DETAIL_COPY.noDocuments}
                </p>
              )}
            </div>
          </section>
        </div>

        <aside className="h-fit rounded-xl border border-[#e1e9f2] bg-[#f9fbfd] p-5">
          <h2 className="text-base font-semibold text-[#253044]">{PROGRAM_DETAIL_COPY.source}</h2>
          <dl className="mt-4 flex flex-col gap-4 text-sm">
            <div>
              <dt className="text-[#64748b]">{PROGRAM_DETAIL_COPY.audience}</dt>
              <dd className="mt-1 font-medium leading-6 text-[#334155]">
                {program.untuk.join(', ')}
              </dd>
            </div>
            <div>
              <dt className="text-[#64748b]">{PROGRAM_DETAIL_COPY.coverage}</dt>
              <dd className="mt-1 font-medium text-[#334155]">
                {PROGRAM_DETAIL_COPY.coverageLabel(program.cakupan.level, program.cakupan.kode)}
              </dd>
            </div>
            {program.periode && (
              <div>
                <dt className="text-[#64748b]">{PROGRAM_DETAIL_COPY.period}</dt>
                <dd className="mt-1 font-medium text-[#334155]">{formatPeriod(program.periode)}</dd>
              </div>
            )}
            <div>
              <dt className="text-[#64748b]">Terakhir diperiksa</dt>
              <dd className="mt-1 font-medium text-[#334155]">
                {formatDate(program.tanggalDiperiksa)}
              </dd>
            </div>
          </dl>
          <ul className="mt-5 flex flex-col gap-2">
            {[program.sumberUtama, ...program.sumberTambahan].map((source, index) => (
              <li key={`${source.url}-${index}`}>
                <a
                  className="flex min-h-11 items-center justify-between gap-3 rounded-lg border border-[#d6e5f5] bg-white px-3 text-sm font-semibold text-[#1769c2] hover:bg-[#f0f6fd] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1769c2]"
                  href={source.url}
                  rel="noreferrer"
                  target="_blank"
                >
                  <span>
                    {index === 0 ? PROGRAM_DETAIL_COPY.primarySource : `Sumber resmi ${index + 1}`}
                  </span>
                  <ExternalLink aria-hidden="true" size={16} />
                </a>
              </li>
            ))}
          </ul>
          <Link
            className="mt-3 flex min-h-11 w-full items-center justify-between gap-3 rounded-lg border border-[#c7dbf2] bg-white px-3 text-sm font-semibold text-[#1769c2] hover:bg-[#f0f6fd] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1769c2]"
            href={programPath(program)}
          >
            {PROGRAM_DETAIL_COPY.publicPage}
            <ArrowUpRight aria-hidden="true" size={16} />
          </Link>
        </aside>
      </div>
    </article>
  );
}
