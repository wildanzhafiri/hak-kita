import { Fragment } from 'react';
import Link from 'next/link';
import { ChevronRight } from 'lucide-react';
import { Eyebrow } from '../ui/eyebrow';
import type { PageShellProps } from './types';

export function PageShell({ breadcrumbs, eyebrow, title, description, children }: PageShellProps) {
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
          <div className="page-intro">
            <Eyebrow>{eyebrow}</Eyebrow>
            <h1>{title}</h1>
            <p>{description}</p>
          </div>
        </div>
      </div>
      <div className="container page-content">{children}</div>
    </div>
  );
}
