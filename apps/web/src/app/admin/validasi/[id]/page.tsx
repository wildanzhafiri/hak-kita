import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import { AdminShell } from '@/components/layout/admin-shell';
import { AdminAccess } from '@/features/admin/admin-access';
import { ProgramKindBadge } from '@/features/admin/program-kind-badge';
import { AUTH_ERROR_COPY } from '@/features/auth/content';
import { getRadarAccessState } from '@/server/admin-access';
import { buildWilayahIndex, wilayahName } from '@hakkita/domain';
import { loadPrograms, loadWilayahFile } from '@/server/data';
import { loadPendingDiscoveredPrograms } from '@/server/radar-program-discovery';
import { loadPendingRadarCandidates } from '@/server/radar-review';
import { VALIDATION_COPY, VALIDATION_DETAIL_COPY } from '../content';
import { formatFoundAt } from '../format-found-at';
import { RadarNewsReview } from '../radar-news-review';
import { RadarProgramReview } from '../radar-program-review';
import type { ValidationDetailRouteContext } from '../types';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Periksa Informasi | HAKKITA',
  robots: { index: false, follow: false },
};

export default async function ValidationDetailPage({ params }: ValidationDetailRouteContext) {
  const access = await getRadarAccessState();
  if (access.status !== 'authorized') {
    const initialMessage =
      access.status === 'forbidden'
        ? AUTH_ERROR_COPY.admin
        : access.status === 'unconfigured'
          ? AUTH_ERROR_COPY.adminSetup
          : null;
    return <AdminAccess initialMessage={initialMessage} />;
  }
  const { id } = await params;
  const [newsCandidates, programCandidates, programs, wilayahFile] = await Promise.all([
    loadPendingRadarCandidates(),
    loadPendingDiscoveredPrograms(),
    loadPrograms(),
    loadWilayahFile(),
  ]);
  const programCandidate = programCandidates.find((candidate) => candidate.id === id);
  const newsCandidate = newsCandidates.find((candidate) => candidate.id === id);
  if (!programCandidate && !newsCandidate) notFound();

  const wilayahIndex = buildWilayahIndex(wilayahFile.wilayah);
  const relatedProgram = programs.find((program) => program.id === newsCandidate?.program_id);
  const name = programCandidate?.record.program.nama ?? newsCandidate?.program_name ?? '';
  const kind =
    programCandidate?.record.program.jenis ??
    programs.find((program) => program.id === newsCandidate?.program_id)?.jenis ??
    'program';
  const finding = programCandidate ? 'new' : 'update';
  const detectedAt = programCandidate?.detected_at ?? newsCandidate?.detected_at ?? '';

  return (
    <AdminShell activeSection="validation" adminEmail={access.email}>
      <div className="mx-auto max-w-[1440px]">
        <Link
          className="inline-flex min-h-10 items-center gap-2 text-sm font-semibold text-[#1769c2] underline-offset-4 hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1769c2]"
          href="/admin/validasi"
        >
          <ArrowLeft aria-hidden="true" size={17} />
          {VALIDATION_COPY.back}
        </Link>
        <header className="mb-5 mt-3">
          <h1 className="text-[28px] font-semibold leading-tight tracking-[-0.025em] text-[#253044]">
            {name}
          </h1>
          <p className="mt-2 text-sm leading-6 text-[#64748b]">
            {VALIDATION_DETAIL_COPY.descriptions[finding]}
          </p>
          <div className="mt-3 flex flex-wrap items-center gap-3 text-xs text-[#64748b]">
            <ProgramKindBadge kind={kind} />
            <span className="inline-flex min-h-8 items-center rounded-full border border-[#d6e5f5] bg-[#eef5fc] px-3 font-semibold text-[#196dcc]">
              {VALIDATION_COPY.findings[finding]}
            </span>
            <span className="inline-flex min-h-8 items-center rounded-full border border-[#d6e5f5] bg-[#eef5fc] px-3 font-semibold text-[#196dcc]">
              {VALIDATION_DETAIL_COPY.status}
            </span>
            <span>{VALIDATION_COPY.foundAt(formatFoundAt(detectedAt))}</span>
          </div>
        </header>
        {programCandidate ? (
          <RadarProgramReview
            candidate={programCandidate}
            regionName={wilayahName(wilayahIndex, programCandidate.record.program.cakupan.kode)}
          />
        ) : newsCandidate ? (
          <RadarNewsReview
            candidate={newsCandidate}
            program={relatedProgram ?? null}
            regionName={
              relatedProgram ? wilayahName(wilayahIndex, relatedProgram.cakupan.kode) : ''
            }
          />
        ) : null}
      </div>
    </AdminShell>
  );
}
