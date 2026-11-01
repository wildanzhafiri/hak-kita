import { Breadcrumbs } from '../ui/breadcrumbs';
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
    <div className="bg-white">
      <div className="container">
        <Breadcrumbs
          label="Jejak navigasi"
          items={[{ label: 'Beranda', href: '/' }, ...breadcrumbs]}
        />
        <header
          className={
            compact
              ? 'max-w-[760px] py-6 max-[700px]:py-[18px]'
              : 'max-w-[900px] pb-11 pt-8 max-[700px]:pb-8'
          }
        >
          {eyebrow && <Eyebrow>{eyebrow}</Eyebrow>}
          <h1 className="mt-3 text-[clamp(32px,3.4vw,44px)] font-bold leading-[1.2] tracking-[-0.035em] text-[#1b304c] max-[700px]:text-[32px]">
            {title}
          </h1>
          <p className="mt-3 max-w-[70ch] text-[15px] leading-[1.7] text-[#617087] max-[700px]:text-[13px]">
            {description}
          </p>
        </header>
        <div className={compact ? 'min-h-[450px] pb-16 max-[700px]:pb-12' : 'pb-16'}>
          {children}
        </div>
      </div>
    </div>
  );
}
