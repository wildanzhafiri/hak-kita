import { SERVICE_DETAIL_CONTENT } from './content';
import { DetailSection } from './detail-section';
import type { DetailProgramSectionProps } from './types';

export function ServiceCostSection({ program }: DetailProgramSectionProps) {
  if (!program.biaya) return null;

  return (
    <DetailSection id="biaya" title={SERVICE_DETAIL_CONTENT.cost} variant="program">
      <p className="m-0 text-[15px] leading-[1.75] text-[#536477]">{program.biaya}</p>
    </DetailSection>
  );
}
