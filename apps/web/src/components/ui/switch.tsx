'use client';

import { Switch as HeroSwitch, cn } from '@heroui/react';
import type { SwitchProps } from './types';

export function Switch({ label, description, isSelected, isDisabled, onChange }: SwitchProps) {
  return (
    <HeroSwitch
      className={cn(
        'group items-start gap-1.5',
        '[--switch-control-bg:#c9d3df] [--switch-control-bg-checked:#196dcc] [--switch-control-bg-checked-hover:#1458a3]',
      )}
      isSelected={isSelected}
      isDisabled={isDisabled}
      onChange={onChange}
    >
      <HeroSwitch.Content className="gap-3 text-sm leading-6 font-semibold text-[#253044]">
        <HeroSwitch.Control>
          <HeroSwitch.Thumb />
        </HeroSwitch.Control>
        <span>{label}</span>
      </HeroSwitch.Content>
      {description && (
        <span className="block pl-[52px] text-sm leading-5 font-normal text-[#64748b]">
          {description}
        </span>
      )}
    </HeroSwitch>
  );
}
