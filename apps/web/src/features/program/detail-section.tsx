import type { DetailSectionProps } from './types';

export function DetailSection({ id, title, children }: DetailSectionProps) {
  return (
    <section
      id={id}
      className="border-b border-[var(--border)] py-[29px] last:border-b-0 max-[700px]:py-[23px]"
      aria-labelledby={`${id}-title`}
    >
      <h2 id={`${id}-title`} className="mb-3 text-[25px] tracking-normal max-[700px]:text-[22px]">
        {title}
      </h2>
      {children}
    </section>
  );
}
