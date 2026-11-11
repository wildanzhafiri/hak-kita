'use client';

import { ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { ProgramFilterTriggerProps } from './types';

export function ProgramFilterTrigger({ label }: ProgramFilterTriggerProps) {
  return (
    <Button
      className="h-11 min-h-0 max-w-full gap-3 border-[#dce1e6] px-4 text-sm font-normal text-[#25354b] hover:border-[#b9c7d6] hover:bg-white"
      tone="secondary"
    >
      <span className="min-w-0 truncate">{label}</span>
      <ChevronDown aria-hidden="true" className="shrink-0 text-[#687385]" size={16} />
    </Button>
  );
}
