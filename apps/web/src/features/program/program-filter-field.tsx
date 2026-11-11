import type { ProgramFilterFieldProps } from './types';

export function ProgramFilterField({
  label,
  hideLabel = false,
  children,
}: ProgramFilterFieldProps) {
  return (
    <div className="flex min-w-0 flex-col gap-2 text-xs font-medium text-[#536477]">
      {!hideLabel && <span>{label}</span>}
      {children}
    </div>
  );
}
