import { Info } from 'lucide-react';
import { SERVICE_DETAIL_CONTENT } from './content';
import { DetailSection } from './detail-section';
import type { DetailProgramSectionProps } from './types';

export function ServiceNoticeSection({ program }: DetailProgramSectionProps) {
  if (!program.catatan) return null;

  return (
    <DetailSection id="informasi-penting" title={SERVICE_DETAIL_CONTENT.notice} variant="program">
      <div className="flex min-w-0 gap-3 rounded-[10px] bg-[#f5f8fc] px-[18px] py-4">
        <Info aria-hidden="true" className="mt-0.5 shrink-0 text-[#1769c2]" size={20} />
        <p className="m-0 min-w-0 text-sm leading-[1.7] text-[#536477] [overflow-wrap:anywhere]">
          {program.catatan}
        </p>
      </div>
    </DetailSection>
  );
}
