'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { RENCANA_NAV } from './constants';
import type { RencanaNavProps } from './types';

export function RencanaNav({ counts }: RencanaNavProps) {
  const pathname = usePathname();

  return (
    <nav className="rencana-nav" aria-label="List Rencanaku">
      {RENCANA_NAV.map(({ href, label, icon: Icon, count }) => {
        const active = pathname === href;
        const total = count === null ? 0 : counts[count];
        return (
          <Link
            key={href}
            href={href}
            className={active ? 'active' : undefined}
            aria-current={active ? 'page' : undefined}
          >
            <Icon size={18} />
            <span>{label}</span>
            {total > 0 && <b>{total}</b>}
          </Link>
        );
      })}
    </nav>
  );
}
