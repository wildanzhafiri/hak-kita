import { DetailDocumentsSection } from './detail-documents-section';
import { DetailRequirementsSection } from './detail-requirements-section';
import { DetailSourcesSection } from './detail-sources-section';
import { DetailStepsSection } from './detail-steps-section';
import { ServiceChannelSection } from './service-channel-section';
import { ServiceCostSection } from './service-cost-section';
import { ServiceDetailActions } from './service-detail-actions';
import { ServiceDetailHeader } from './service-detail-header';
import { ServiceDetailMetadata } from './service-detail-metadata';
import { ServiceNoticeSection } from './service-notice-section';
import { ServiceOverviewSection } from './service-overview-section';
import { ServiceRelatedSection } from './service-related-section';
import type { ServiceDetailProps } from './types';

export function ServiceDetail({ program, namaCakupan, related }: ServiceDetailProps) {
  return (
    <div className="mx-auto mt-[59px] w-full max-w-[900px] min-w-0 text-[#1b304c] max-[640px]:mt-8">
      <ServiceDetailHeader program={program} />
      <ServiceDetailMetadata program={program} namaCakupan={namaCakupan} />
      <article className="min-w-0 [&_p]:break-words">
        <ServiceOverviewSection program={program} />
        <DetailRequirementsSection program={program} />
        <DetailDocumentsSection program={program} />
        <ServiceCostSection program={program} />
        <DetailStepsSection program={program} />
        <ServiceChannelSection program={program} />
        <ServiceDetailActions program={program} />
        <ServiceNoticeSection program={program} />
        <DetailSourcesSection program={program} />
        <ServiceRelatedSection related={related} />
      </article>
    </div>
  );
}
