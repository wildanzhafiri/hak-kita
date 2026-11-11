import { ExternalLink } from 'lucide-react';
import { isLayanan } from '@hakkita/domain';
import { SERVICE_DETAIL_CONTENT } from './content';
import { DetailSection } from './detail-section';
import type { RequirementsSectionProps } from './types';

export function DetailRequirementsSection({ program }: RequirementsSectionProps) {
  const layanan = isLayanan(program);

  return (
    <DetailSection
      id="persyaratan"
      title={layanan ? SERVICE_DETAIL_CONTENT.requirements : 'Persyaratan dan Ketentuan'}
      variant="program"
    >
      {!layanan && (
        <h3 className="mb-3 mt-[18px] text-base font-semibold text-[#1b304c]">Ketentuan Peserta</h3>
      )}
      <ul className="m-0 list-disc space-y-[9px] pl-6 text-[15px] leading-[1.75] text-[#536477] [overflow-wrap:anywhere]">
        {program.syarat.map((syarat) => (
          <li key={syarat.teks}>
            {syarat.teks}
            {layanan && syarat.sumberUrl && (
              <a
                aria-label={SERVICE_DETAIL_CONTENT.requirementSource}
                className="ml-1.5 inline-flex align-middle text-[#1769c2] hover:text-[#1458a3]"
                href={syarat.sumberUrl}
                rel="noreferrer"
                target="_blank"
              >
                <ExternalLink aria-hidden="true" size={14} />
              </a>
            )}
          </li>
        ))}
      </ul>
      {!layanan && (
        <a
          className="mt-7 inline-flex items-center gap-2 text-sm text-[#1769c2] hover:underline"
          href={
            program.syarat.find((syarat) => syarat.sumberUrl)?.sumberUrl ?? program.sumberUtama.url
          }
          rel="noreferrer"
          target="_blank"
        >
          Periksa persyaratan secara rinci <ExternalLink aria-hidden="true" size={14} />
        </a>
      )}
    </DetailSection>
  );
}
