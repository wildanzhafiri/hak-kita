'use client';

import { Input, cn } from '@heroui/react';
import type { TextInputProps } from './types';

export function TextInput({ className, ...props }: TextInputProps) {
  return (
    <Input
      {...props}
      className={cn(
        'min-h-11 w-full rounded-lg border border-[#dce1e6] bg-white px-3 text-sm text-[#25354b] outline-none transition-colors placeholder:text-[#77808c] focus:border-[#196dcc] focus:ring-2 focus:ring-[#196dcc]/15 disabled:cursor-not-allowed disabled:bg-[#f7f8fa] motion-reduce:transition-none',
        className,
      )}
    />
  );
}
