'use client';

import { Checkbox as HeroCheckbox, cn } from '@heroui/react';
import { Check } from 'lucide-react';
import type { CheckboxProps } from './types';

export function Checkbox({ children, isSelected, isDisabled, onChange }: CheckboxProps) {
  return (
    <HeroCheckbox
      className="group flex items-start gap-3 text-sm leading-6 text-[#435570]"
      isSelected={isSelected}
      isDisabled={isDisabled}
      onChange={onChange}
    >
      <HeroCheckbox.Content className="flex items-start gap-3">
        <HeroCheckbox.Control
          className={cn(
            'mt-1 grid size-4 shrink-0 place-items-center rounded border border-[#aeb8c4] bg-white text-white transition-colors',
            'group-data-[selected=true]:border-[#196dcc] group-data-[selected=true]:bg-[#196dcc]',
            'group-focus-visible:outline-2 group-focus-visible:outline-offset-2 group-focus-visible:outline-[#196dcc]',
          )}
        >
          <HeroCheckbox.Indicator>
            <Check aria-hidden="true" size={12} strokeWidth={3} />
          </HeroCheckbox.Indicator>
        </HeroCheckbox.Control>
        <span>{children}</span>
      </HeroCheckbox.Content>
    </HeroCheckbox>
  );
}
