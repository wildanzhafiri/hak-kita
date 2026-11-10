'use client';

import { SelectField } from '@/components/ui/select-field';
import type { BudgetFilterFieldProps } from './types';

export function BudgetFilterField({
  label,
  placeholder,
  value,
  options,
  isDisabled = false,
  onChange,
}: BudgetFilterFieldProps) {
  return (
    <div className="grid min-w-0 gap-2">
      <span className="text-xs font-semibold text-[#344458]">{label}</span>
      <SelectField
        className="min-w-0"
        isDisabled={isDisabled}
        label={label}
        onChange={onChange}
        options={options}
        placeholder={placeholder ?? `Pilih ${label.toLocaleLowerCase('id-ID')}`}
        value={value}
      />
    </div>
  );
}
