import { SERVICE_CHANNEL_LABELS } from './constants';
import { SERVICE_DETAIL_CONTENT } from './content';
import { DetailSection } from './detail-section';
import type { DetailProgramSectionProps } from './types';

export function ServiceChannelSection({ program }: DetailProgramSectionProps) {
  if (!program.kanal?.length) return null;
  const hasOnline = program.kanal.includes('online');
  const hasOffline = program.kanal.includes('offline');
  const label =
    hasOnline && hasOffline
      ? SERVICE_CHANNEL_LABELS.both
      : hasOnline
        ? SERVICE_CHANNEL_LABELS.online
        : SERVICE_CHANNEL_LABELS.offline;

  return (
    <DetailSection id="kanal" title={SERVICE_DETAIL_CONTENT.channel} variant="program">
      <p className="m-0 text-[15px] leading-[1.75] text-[#536477]">{label}</p>
    </DetailSection>
  );
}
