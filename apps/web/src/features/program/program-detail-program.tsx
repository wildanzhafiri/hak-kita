import Image from 'next/image';
import Link from 'next/link';
import { ArrowLeft, Info } from 'lucide-react';
import { PROGRAM_CATEGORY_ARTWORK, PROGRAM_DETAIL_CATEGORY_LABELS } from './constants';
import { DetailBenefitSection } from './detail-benefit-section';
import { DetailDocumentsSection } from './detail-documents-section';
import { DetailPeriodSection } from './detail-period-section';
import { DetailRequirementsSection } from './detail-requirements-section';
import { DetailSection } from './detail-section';
import { DetailSourcesSection } from './detail-sources-section';
import { DetailStepsSection } from './detail-steps-section';
import { ProgramDetailActions } from './program-detail-actions';
import { ProgramDetailMetadata } from './program-detail-metadata';
import type { ProgramDetailProps } from './types';

export function ProgramDetailProgram({ program, namaCakupan }: ProgramDetailProps) {
  const artwork = PROGRAM_CATEGORY_ARTWORK[program.kategori];

  return (
    <div className="mx-auto mt-[62px] w-full max-w-[900px] min-w-0 text-[#1b304c] max-[640px]:mt-8">
      <header className="mb-[22px] min-w-0 max-[640px]:mb-[18px] max-[640px]:pb-3">
        <div className="grid min-w-0 grid-cols-[minmax(0,1fr)_64px] items-start gap-[14px] sm:grid-cols-[minmax(0,1fr)_104px] sm:gap-10">
          <div className="min-w-0">
            <span className="mb-4 inline-block rounded-full bg-[#edf5ff] px-2.5 py-1 text-[13px] font-medium text-[#1769c2]">
              {PROGRAM_DETAIL_CATEGORY_LABELS[program.kategori] ?? program.kategori}
            </span>
            <h1 className="m-0 break-words text-[32px] font-bold leading-[1.23] tracking-[-0.025em] max-[640px]:text-[26px]">
              {program.nama}
            </h1>
            <p className="mt-[18px] text-base leading-[1.7] text-[#617087] max-[640px]:text-[15px]">
              {program.ringkasan}
            </p>
          </div>
          {artwork && (
            <Image
              className="size-16 object-contain sm:size-[104px]"
              src={artwork}
              width={104}
              height={104}
              alt=""
            />
          )}
        </div>
      </header>
      <ProgramDetailMetadata program={program} namaCakupan={namaCakupan} />
      {program.tipeGerbang === 'desil' && (
        <div className="mb-6 flex min-h-[112px] min-w-0 gap-3 rounded-[10px] bg-[#f5f8fc] px-[18px] py-4 max-[640px]:min-h-0">
          <Info aria-hidden="true" className="mt-0.5 shrink-0 text-[#1769c2]" size={20} />
          <div className="min-w-0">
            <strong className="text-[13px] font-semibold">Mengikuti ketentuan</strong>
            <p className="mt-2 text-sm leading-[1.7] text-[#536477]">
              Data desil ditetapkan oleh pemerintah. HAKKITA tidak memeriksa atau menghitung
              desilmu. Periksa melalui kanal resmi.
            </p>
          </div>
        </div>
      )}
      <article className="min-w-0 [&_p]:break-words">
        <DetailSection id="tentang" title="Tentang Program" variant="program">
          <p className="text-[15px] leading-[1.75] text-[#536477]">
            Program ini diselenggarakan oleh {program.penyelenggara} untuk{' '}
            {program.untuk.join(', ').toLowerCase()}.
          </p>
        </DetailSection>
        <DetailBenefitSection program={program} />
        <DetailSection id="sasaran" title="Sasaran Program" variant="program">
          <ul className="list-disc space-y-[9px] pl-6 text-[15px] leading-[1.75] text-[#536477]">
            {program.untuk.map((target) => (
              <li key={target}>{target}</li>
            ))}
          </ul>
        </DetailSection>
        <DetailRequirementsSection program={program} />
        <DetailDocumentsSection program={program} />
        <DetailPeriodSection program={program} />
        <DetailStepsSection program={program} />
        <ProgramDetailActions program={program} />
        <DetailSourcesSection program={program} />
        <Link
          className="inline-flex items-center gap-2 text-sm font-medium text-[#1769c2] hover:underline"
          href="/kenali-hakmu"
        >
          <ArrowLeft aria-hidden="true" size={17} /> Kembali ke Kenali Hakmu
        </Link>
      </article>
    </div>
  );
}
