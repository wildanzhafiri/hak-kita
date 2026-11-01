'use client';

import { Accordion } from '@heroui/react';
import { Plus } from 'lucide-react';
import type { FaqAccordionProps } from './types';

export function FaqAccordion({ items }: FaqAccordionProps) {
  return (
    <Accordion className="min-w-0" variant="default">
      {items.map(({ question, answer }, index) => (
        <Accordion.Item className="border-b border-[#e1e7ee]" id={String(index)} key={question}>
          <Accordion.Heading>
            <Accordion.Trigger className="group flex min-h-[70px] w-full items-center justify-between gap-5 py-5 text-left text-[15px] font-medium leading-[1.6] text-[#25354b] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#196dcc] max-[640px]:min-h-[64px] max-[640px]:text-sm">
              <span>{question}</span>
              <Accordion.Indicator className="shrink-0 text-[#526173]">
                <Plus
                  aria-hidden="true"
                  className="transition-transform duration-200 group-aria-expanded:rotate-45 motion-reduce:transition-none"
                  size={18}
                />
              </Accordion.Indicator>
            </Accordion.Trigger>
          </Accordion.Heading>
          <Accordion.Panel className="grid grid-rows-[0fr] opacity-0 transition-[grid-template-rows,opacity] duration-200 ease-out aria-[hidden=false]:grid-rows-[1fr] aria-[hidden=false]:opacity-100 motion-reduce:transition-none">
            <Accordion.Body className="min-h-0 overflow-hidden">
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
