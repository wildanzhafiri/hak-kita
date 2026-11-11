'use client';

import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { FaqAccordion } from '@/components/ui/faq-accordion';
import { HOME_CONTAINER_CLASSES, HOME_HEADING_CLASSES } from './constants';
import { HOME_FAQ_ITEMS } from './content';

export function HomeFaq() {
  return (
    <section className="bg-white py-20 max-[900px]:py-16 max-[640px]:py-[50px]">
      <div
        className={`${HOME_CONTAINER_CLASSES} grid grid-cols-[minmax(0,1fr)_minmax(0,1.85fr)] items-start gap-14! max-[1023px]:gap-9! max-[760px]:grid-cols-1 max-[760px]:gap-7!`}
      >
        <div className="flex flex-col gap-9 self-stretch max-[760px]:contents">
          <div className="max-[760px]:row-start-1">
            <p className="mb-5 flex items-center gap-[9px] text-[11px] font-semibold tracking-[0.08em] max-[640px]:mb-[15px]">
              <span aria-hidden="true" className="size-1.5 rounded-full bg-[#196dcc]" /> FAQ
            </p>
            <h2 className={`max-w-[390px] ${HOME_HEADING_CLASSES}`}>
              Pertanyaan yang sering diajukan
            </h2>
          </div>
          <div className="mt-auto max-[760px]:row-start-3 max-[760px]:mt-0">
            <h3 className="text-[17px] font-semibold capitalize">Masih punya pertanyaan?</h3>
            <p className="mt-2 max-w-[345px] text-sm leading-[1.7] text-[#647386]">
              Temukan panduan untuk menjelajahi program, layanan, dan fitur HAKKITA.
            </p>
            <Link
              className="mt-[22px] inline-flex min-h-11 items-center gap-2 rounded-[7px] bg-[#196dcc] px-4 text-[13px] font-semibold text-white hover:bg-[#1458a3]"
              href="/bantuan"
            >
              Pusat Bantuan <ArrowRight size={18} />
            </Link>
          </div>
        </div>
        <div className="min-w-0 max-[760px]:row-start-2">
          <FaqAccordion items={HOME_FAQ_ITEMS} />
        </div>
      </div>
    </section>
  );
}
