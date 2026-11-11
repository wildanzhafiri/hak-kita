import type { DetailSectionProps } from './types';

export function DetailSection({ id, title, children, variant }: DetailSectionProps) {
  return (
    <section
      id={id}
      className={
        variant === 'program'
          ? 'min-w-0 border-t border-[#e1e7ee] pb-9 pt-7 max-[640px]:pb-8 max-[640px]:pt-[22px]'
          : 'border-b border-[var(--border)] py-[29px] last:border-b-0 max-[700px]:py-[23px]'
      }
      aria-labelledby={`${id}-title`}
    >
      <h2
        id={`${id}-title`}
        className={
          variant === 'program'
            ? 'mb-4 text-2xl font-semibold leading-[1.35] tracking-[-0.02em] text-[#1b304c] max-[640px]:text-[21px]'
            : 'mb-3 text-[25px] tracking-normal max-[700px]:text-[22px]'
        }
      >
        {title}
      </h2>
      {children}
    </section>
  );
}
