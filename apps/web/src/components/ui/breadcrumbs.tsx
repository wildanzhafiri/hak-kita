'use client';

import { Breadcrumbs as HeroBreadcrumbs } from '@heroui/react';
import { ChevronRight } from 'lucide-react';
import type { BreadcrumbsProps } from './types';

export function Breadcrumbs({ label, items }: BreadcrumbsProps) {
  return (
    <HeroBreadcrumbs
      aria-label={label}
      className="flex min-w-0 items-center gap-2 pt-5 text-xs text-[#687385]"
      separator={<ChevronRight aria-hidden="true" size={13} />}
    >
      {items.map(({ label: itemLabel, href }, index) => (
        <HeroBreadcrumbs.Item
          className="min-w-0 truncate text-[#25354b] hover:text-[#196dcc]"
          href={href}
          key={`${itemLabel}-${index}`}
        >
          {itemLabel}
        </HeroBreadcrumbs.Item>
      ))}
    </HeroBreadcrumbs>
  );
}
