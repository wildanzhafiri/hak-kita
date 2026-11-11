import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { programPath } from '@hakkita/domain';
import { SERVICE_DETAIL_CONTENT } from './content';
import { DetailSection } from './detail-section';
import type { ServiceRelatedSectionProps } from './types';

export function ServiceRelatedSection({ related }: ServiceRelatedSectionProps) {
  if (related.length === 0) return null;

  return (
    <DetailSection id="terkait" title={SERVICE_DETAIL_CONTENT.related} variant="program">
      <ul className="m-0 flex list-none flex-col gap-[18px] p-0">
        {related.map((service) => (
          <li className="min-w-0" key={service.id}>
            <Link
              className="inline-flex items-center gap-2 font-medium text-[#1769c2] hover:underline"
              href={programPath(service)}
            >
              {service.nama} <ArrowRight aria-hidden="true" size={16} />
            </Link>
            <p className="mb-0 mt-1.5 text-sm leading-[1.7] text-[#536477]">{service.ringkasan}</p>
          </li>
        ))}
      </ul>
    </DetailSection>
  );
}
