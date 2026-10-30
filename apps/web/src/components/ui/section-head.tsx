import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';
import { Eyebrow } from './eyebrow';
import type { SectionHeadProps } from './types';

export function SectionHead({ eyebrow, title, description, href, linkText }: SectionHeadProps) {
  return (
    <div className="section-head">
      <div>
        <Eyebrow>{eyebrow}</Eyebrow>
        <h2>{title}</h2>
        {description && <p>{description}</p>}
      </div>
      {href && (
        <Link className="text-link" href={href}>
          {linkText ?? 'Lihat semua'}
          <ArrowUpRight size={17} />
        </Link>
      )}
    </div>
  );
}
