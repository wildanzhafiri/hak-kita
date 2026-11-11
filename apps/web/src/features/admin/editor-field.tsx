import type { EditorFieldProps } from './types';

export function EditorField({
  label,
  hint,
  isRequired = false,
  className,
  children,
}: EditorFieldProps) {
  return (
    <div className={`flex min-w-0 flex-col gap-1.5 ${className ?? ''}`}>
      <label className="flex flex-col gap-2 text-sm font-medium text-[#334155]">
        <span
          className={isRequired ? "after:ml-1 after:text-[#a72b32] after:content-['*']" : undefined}
        >
          {label}
        </span>
        {children}
      </label>
      {hint && <span className="text-xs text-[#64748b]">{hint}</span>}
    </div>
  );
}
