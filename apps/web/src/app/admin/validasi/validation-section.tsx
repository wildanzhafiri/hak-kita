import type { ValidationSectionProps } from './types';

export function ValidationSection({ title, children }: ValidationSectionProps) {
  return (
    <section className="my-6 rounded-xl border border-[#e1e9f2] bg-white p-5 sm:p-6">
      <h2 className="mb-4 text-lg font-semibold tracking-[-0.01em] text-[#253044]">{title}</h2>
      {children}
    </section>
  );
}
