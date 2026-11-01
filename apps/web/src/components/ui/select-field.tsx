'use client';

import { Check, ChevronDown } from 'lucide-react';
import { Label, ListBox, Select } from '@heroui/react';
import type { SelectFieldProps } from './types';

export function SelectField({
  label,
  placeholder,
  value,
  options,
  isDisabled = false,
  onChange,
}: SelectFieldProps) {
  return (
    <Select
      className="w-full"
      isDisabled={isDisabled}
      placeholder={placeholder}
      value={value}
      onChange={(selectedValue) => onChange(selectedValue?.toString() ?? '')}
    >
      <Label className="sr-only">{label}</Label>
      <Select.Trigger className="flex min-h-11 w-full items-center justify-between gap-3 rounded-lg border border-[#dce1e6] bg-white px-3 text-left text-sm text-[#25354b] outline-none transition-colors hover:border-[#b9c7d6] focus-visible:border-[#196dcc] focus-visible:ring-2 focus-visible:ring-[#196dcc]/15 disabled:cursor-not-allowed disabled:opacity-50 motion-reduce:transition-none">
        <Select.Value className="min-w-0 flex-1 truncate" />
        <Select.Indicator className="shrink-0 text-[#687385]">
          <ChevronDown aria-hidden="true" size={16} />
        </Select.Indicator>
      </Select.Trigger>
      <Select.Popover className="z-50 mt-1 max-h-72 min-w-[var(--trigger-width)] overflow-y-auto overscroll-contain rounded-lg border border-[#dce1e6] bg-white py-1 shadow-lg">
        <ListBox className="outline-none">
          {options.map((option) => (
            <ListBox.Item
              className="flex cursor-pointer items-center justify-between gap-3 px-3 py-2 text-sm text-[#25354b] outline-none hover:bg-[#f0f6fd] focus:bg-[#f0f6fd] data-[selected=true]:bg-[#f0f6fd]"
              id={option.value}
              key={option.value}
              textValue={option.label}
            >
              <span className="min-w-0 truncate">{option.label}</span>
              <ListBox.ItemIndicator className="shrink-0 text-[#196dcc]">
                {({ isSelected }) => (isSelected ? <Check aria-hidden="true" size={15} /> : null)}
              </ListBox.ItemIndicator>
            </ListBox.Item>
          ))}
        </ListBox>
      </Select.Popover>
    </Select>
  );
}
