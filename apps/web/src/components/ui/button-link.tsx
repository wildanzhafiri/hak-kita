import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';
import type { ButtonLinkProps } from './types';

export function ButtonLink({ href, children, secondary = false }: ButtonLinkProps) {
  return (
    <Link href={href} className={secondary ? 'button secondary' : 'button'}>
      {children}
      <ArrowUpRight size={17} />
    </Link>
  );
}
