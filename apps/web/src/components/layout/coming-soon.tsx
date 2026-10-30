import { ButtonLink } from '../ui/button-link';
import { Eyebrow } from '../ui/eyebrow';
import { PageShell } from './page-shell';
import type { ComingSoonProps } from './types';

export function ComingSoon({
  breadcrumbs,
  eyebrow,
  title,
  description,
  body,
  points,
  action,
}: ComingSoonProps) {
  return (
    <PageShell breadcrumbs={breadcrumbs} eyebrow={eyebrow} title={title} description={description}>
      <div className="reading">
        <section className="panel">
          <Eyebrow>SEDANG KAMI SIAPKAN</Eyebrow>
          <h2>Halaman ini masih dalam pengerjaan.</h2>
          <p>{body}</p>
          <ul className="prose-list">
            {points.map((point) => (
              <li key={point}>{point}</li>
            ))}
          </ul>
          <ButtonLink href={action.href}>{action.label}</ButtonLink>
        </section>
      </div>
    </PageShell>
  );
}
