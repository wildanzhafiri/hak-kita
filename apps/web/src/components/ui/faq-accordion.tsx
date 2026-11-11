'use client';

import { Accordion } from '@heroui/react';
import { Minus, Plus } from 'lucide-react';
import type { FaqAccordionProps } from './types';

export function FaqAccordion({ items }: FaqAccordionProps) {
  return (
    <Accordion className="min-w-0" variant="default">
      {items.map(({ question, answer }, index) => (
        <Accordion.Item className="border-b border-[#e1e7ee]" id={String(index)} key={question}>
          <Accordion.Heading>
            <Accordion.Trigger className="flex min-h-[70px] w-full items-center justify-between gap-5 py-5 text-left text-[15px] font-medium leading-[1.6] text-[#25354b] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#196dcc] max-[640px]:min-h-[64px] max-[640px]:text-sm">
              <span>{question}</span>
              <Accordion.Indicator className="group/indicator relative block size-[18px] shrink-0 text-[#526173] data-[expanded=true]:rotate-0">
                <span>
                  <Plus
                    aria-hidden="true"
                    className="absolute inset-0 transition-[opacity,rotate] duration-[360ms] ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none group-data-[expanded=true]/indicator:rotate-90 group-data-[expanded=true]/indicator:opacity-0"
                    size={18}
                  />
                  <Minus
                    aria-hidden="true"
                    className="absolute inset-0 -rotate-90 opacity-0 transition-[opacity,rotate] duration-[360ms] ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none group-data-[expanded=true]/indicator:rotate-0 group-data-[expanded=true]/indicator:opacity-100"
                    size={18}
                  />
                </span>
              </Accordion.Indicator>
            </Accordion.Trigger>
          </Accordion.Heading>
          <Accordion.Panel className="duration-[360ms] ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none">
            <Accordion.Body>
              <p className="m-0 pb-[22px] pr-10 text-[13px] leading-[1.85] text-[#637185]">
                {answer}
              </p>
            </Accordion.Body>
          </Accordion.Panel>
        </Accordion.Item>
      ))}
    </Accordion>
  );
}
