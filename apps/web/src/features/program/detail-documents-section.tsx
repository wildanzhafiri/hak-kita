import { Check } from 'lucide-react';
import { isLayanan } from '@hakkita/domain';
import { DetailSection } from './detail-section';
import type { DetailProgramSectionProps } from './types';

export function DetailDocumentsSection({ program }: DetailProgramSectionProps) {
  if (!program.dokumen.length) return null;

  if (isLayanan(program)) {
    return (
      <DetailSection id="dokumen" title="Dokumen yang Perlu Disiapkan" variant="program">
        <ul className="m-0 list-disc space-y-[9px] pl-6 text-[15px] leading-[1.75] text-[#536477] [overflow-wrap:anywhere]">
          {program.dokumen.map((document) => (
            <li key={document}>{document}</li>
          ))}
        </ul>
      </DetailSection>
    );
  }

  return (
    <DetailSection id="dokumen" title="Dokumen yang Perlu Disiapkan" variant="program">
      <ul className="min-w-0 divide-y divide-[#edf0f4]">
        {program.dokumen.map((document) => (
          <li className="flex min-w-0 gap-3 py-[13px] first:pt-0" key={document}>
            <Check aria-hidden="true" className="mt-1 shrink-0 text-[#1769c2]" size={18} />
            <span className="min-w-0 break-words text-[15px] leading-[1.7] text-[#1b304c]">
              {document}
            </span>
          </li>
        ))}
      </ul>
    </DetailSection>
  );
}
