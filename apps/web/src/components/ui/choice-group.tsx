'use client';

import { Radio, RadioGroup, cn } from '@heroui/react';
import type { ChoiceGroupProps } from './types';

export function ChoiceGroup({
  name,
  value,
  options,
  layout = 'cards',
  onChange,
}: ChoiceGroupProps) {
  const isCardLayout = layout === 'cards';

  return (
    <RadioGroup
      className={cn(isCardLayout ? 'grid gap-3 sm:grid-cols-2' : 'flex flex-wrap gap-2')}
      name={name}
      value={value ?? ''}
      onChange={onChange}
    >
      {options.map((option) => (
        <Radio
          className={cn(
            isCardLayout
              ? 'w-full rounded-lg border border-[#dce1e6] bg-white text-sm text-[#34445a] transition-colors data-[selected=true]:border-[#196dcc] data-[selected=true]:bg-[#f0f6fd]'
              : 'rounded-lg border border-[#dce1e6] bg-white px-3 py-2 text-sm text-[#526173] transition-colors data-[selected=true]:border-[#196dcc] data-[selected=true]:bg-[#f0f6fd] data-[selected=true]:text-[#196dcc]',
          )}
          key={option.value}
          value={option.value}
        >
          <Radio.Content
            className={cn(
              isCardLayout
                ? 'flex min-h-12 items-center gap-3 px-4 py-3'
                : 'flex items-center gap-2',
            )}
          >
            <Radio.Control className="grid size-4 shrink-0 place-items-center rounded-full border border-[#aeb8c4] transition-colors data-[selected=true]:border-[#196dcc] data-[selected=true]:bg-[#196dcc]">
              <Radio.Indicator className="size-1.5 rounded-full bg-white" />
            </Radio.Control>
            <span>{option.label}</span>
          </Radio.Content>
        </Radio>
      ))}
    </RadioGroup>
  );
}
