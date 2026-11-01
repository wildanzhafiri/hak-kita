'use client';

import { TextArea, cn } from '@heroui/react';
import type { TextAreaProps } from './types';

export function TextAreaInput({ className, ...props }: TextAreaProps) {
  return (
    <TextArea
      {...props}
      className={cn(
        'min-h-28 w-full resize-y rounded-lg border border-[#dce1e6] bg-white px-3 py-2.5 text-sm leading-6 text-[#25354b] outline-none transition-colors placeholder:text-[#77808c] focus:border-[#196dcc] focus:ring-2 focus:ring-[#196dcc]/15 motion-reduce:transition-none',
        className,
      )}
    />
  );
}
