import { SERVICE_DETAIL_CONTENT } from './content';
import { DetailSection } from './detail-section';
import type { DetailProgramSectionProps } from './types';

export function ServiceOverviewSection({ program }: DetailProgramSectionProps) {
  if (!program.tentang) return null;

  return (
    <DetailSection id="ringkasan" title={SERVICE_DETAIL_CONTENT.overview} variant="program">
      <p className="m-0 text-[15px] leading-[1.75] text-[#536477] [overflow-wrap:anywhere]">
        {program.tentang}
      </p>
    </DetailSection>
  );
}
