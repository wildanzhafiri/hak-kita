import type { AuthFieldProps } from './types';

export function AuthField({ id, label, error, children }: AuthFieldProps) {
  return (
    <div className="flex flex-col gap-[7px]">
      <label className="text-sm font-medium capitalize" htmlFor={id}>
        {label}
      </label>
      {children}
      {error && (
        <p className="m-0 text-[13px] text-[#a13239]" id={`${id}-error`}>
          {error}
        </p>
      )}
    </div>
  );
}
