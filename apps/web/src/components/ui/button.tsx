'use client';

import { Button as HeroButton, cn } from '@heroui/react';
import type { ButtonProps } from './types';

const TONE_CLASSES = {
  primary:
    'inline-flex min-h-11 items-center justify-center gap-2 rounded-lg bg-[#196dcc] px-5 font-semibold text-white transition-colors hover:bg-[#1458a3] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#196dcc] disabled:cursor-not-allowed disabled:opacity-50 motion-reduce:transition-none',
  secondary:
    'inline-flex min-h-11 items-center justify-center gap-2 rounded-lg border border-[#c7dbf2] bg-white px-5 font-semibold text-[#196dcc] transition-colors hover:bg-[#f0f6fd] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#196dcc] disabled:cursor-not-allowed disabled:opacity-50 motion-reduce:transition-none',
  quiet:
    'inline-flex min-h-10 items-center justify-center gap-2 rounded-lg bg-transparent px-3 font-medium text-[#196dcc] transition-colors hover:bg-[#f0f6fd] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#196dcc] motion-reduce:transition-none',
  icon: 'inline-flex size-10 items-center justify-center rounded-lg text-[#526173] transition-colors hover:bg-[#f0f6fd] hover:text-[#196dcc] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#196dcc] motion-reduce:transition-none',
  danger:
    'inline-flex min-h-11 items-center justify-center gap-2 rounded-lg bg-[#b72f35] px-5 font-semibold text-white transition-colors hover:bg-[#98252a] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#b72f35] disabled:cursor-not-allowed disabled:opacity-50 motion-reduce:transition-none',
} as const;

export function Button({ tone = 'primary', className, ...props }: ButtonProps) {
  const variant =
    tone === 'secondary'
      ? 'secondary'
      : tone === 'danger'
        ? 'danger'
        : tone === 'icon' || tone === 'quiet'
          ? 'ghost'
          : 'primary';

  return (
    <HeroButton
      {...props}
      className={cn(TONE_CLASSES[tone], className)}
      isIconOnly={tone === 'icon'}
      variant={variant}
    />
  );
}
