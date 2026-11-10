'use client';

import { Accordion } from '@heroui/react';
import { ArrowUpRight, ChevronDown } from 'lucide-react';
import type { BudgetSourcesProps } from './types';

export function BudgetSources({ sources, note }: BudgetSourcesProps) {
  return (
    <section aria-label="Sumber informasi anggaran" className="mt-5 border-t border-[#e1e9f2] pt-4">
      <Accordion variant="default">
        <Accordion.Item id="sources">
          <Accordion.Heading>
            <Accordion.Trigger className="flex min-h-[54px] w-full items-center justify-between gap-4 rounded-[10px] border border-[#e1e9f2] bg-[#f5f8fc] px-4 py-3 text-left text-[15px] font-semibold text-[#253044] hover:border-[#cbdced] hover:bg-[#edf5ff] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1769c2]">
              <span>Sumber informasi</span>
              <Accordion.Indicator className="group/indicator shrink-0 text-[#1769c2]">
                <ChevronDown
                  aria-hidden="true"
                  className="transition-transform group-data-[expanded=true]/indicator:rotate-180 motion-reduce:transition-none"
                  size={18}
                />
              </Accordion.Indicator>
            </Accordion.Trigger>
          </Accordion.Heading>
          <Accordion.Panel>
            <Accordion.Body>
              <div className="pt-4 text-[13px] leading-[1.6] text-[#657386]">
                <p>{note}</p>
                <ul className="mt-2 grid">
                  {sources.map((source) => (
                    <li
                      className="flex flex-wrap gap-x-4 gap-y-1 border-t border-[#e1e9f2] py-2"
                      key={source.url}
                    >
                      <a
                        className="inline-flex items-center gap-1 font-semibold text-[#1769c2] hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1769c2]"
                        href={source.url}
                        rel="noreferrer"
                        target="_blank"
                      >
                        {source.label}
                        <ArrowUpRight aria-hidden="true" size={15} />
                      </a>
                      <span className="text-xs text-[#718196]">{source.note}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </Accordion.Body>
          </Accordion.Panel>
        </Accordion.Item>
      </Accordion>
    </section>
  );
}
