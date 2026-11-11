'use client';

import { Popover as HeroPopover, cn } from '@heroui/react';
import type { PopoverProps } from './types';

export function Popover({ trigger, label, open, onOpenChange, className, children }: PopoverProps) {
  return (
    <HeroPopover isOpen={open} onOpenChange={onOpenChange}>
      {trigger}
      <HeroPopover.Content className="z-50" offset={8} placement="bottom start">
        <HeroPopover.Dialog
          aria-label={label}
          className={cn(
            'max-h-[min(70dvh,420px)] w-[min(320px,calc(100vw-32px))] overflow-y-auto rounded-xl border border-[#dce1e6] bg-white p-4 text-[#25354b] shadow-lg outline-none',
            className,
          )}
        >
          {children}
        </HeroPopover.Dialog>
      </HeroPopover.Content>
    </HeroPopover>
  );
}
