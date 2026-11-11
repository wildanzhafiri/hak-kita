import { DetailSection } from './detail-section';
import type { DetailProgramSectionProps } from './types';

export function DetailBenefitSection({ program }: DetailProgramSectionProps) {
  if (!program.manfaat?.length) return null;

  return (
    <DetailSection id="manfaat" title="Manfaat dan Bentuk Dukungan" variant="program">
      <ul className="list-disc space-y-[9px] pl-6 text-[15px] leading-[1.75] text-[#536477]">
        {program.manfaat.map((benefit) => (
          <li key={benefit}>{benefit}</li>
        ))}
      </ul>
    </DetailSection>
  );
}
