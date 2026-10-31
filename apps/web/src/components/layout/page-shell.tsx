import { Fragment } from 'react';
import Link from 'next/link';
import { ChevronRight } from 'lucide-react';
import { Eyebrow } from '../ui/eyebrow';
import type { PageShellProps } from './types';

export function PageShell({
  breadcrumbs,
  eyebrow,
  compact = false,
  title,
  description,
  children,
}: PageShellProps) {
  return (
    <div className="inner-page">
      <div className="page-banner">
        <div className="container">
          <nav className="breadcrumbs" aria-label="Breadcrumb">
            <Link href="/">Beranda</Link>
            {breadcrumbs.map((item) => (
              <Fragment key={item.label}>
                <ChevronRight size={13} />
                {item.href ? <Link href={item.href}>{item.label}</Link> : <span>{item.label}</span>}
              </Fragment>
            ))}
          </nav>
          <div className={compact ? 'max-w-[760px] py-6 max-[700px]:py-[18px]' : 'page-intro'}>
            {eyebrow && <Eyebrow>{eyebrow}</Eyebrow>}
            <h1
              className={
                compact
                  ? 'max-w-[760px] text-[clamp(32px,3vw,43px)] tracking-[-0.04em] max-[700px]:text-[32px]'
                  : undefined
              }
            >
              {title}
            </h1>
            <p
              className={
                compact
                  ? 'mt-2 max-w-[65ch] text-[15px] leading-[1.65] max-[700px]:text-[13px]'
                  : undefined
              }
            >
              {description}
            </p>
          </div>
        </div>
      </div>
      <div
        className={
          compact
            ? 'container min-h-[450px] pb-[85px] max-[700px]:pb-[50px]'
            : 'container page-content'
        }
      >
        {children}
      </div>
    </div>
  );
}
