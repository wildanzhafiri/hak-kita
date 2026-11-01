'use client';

import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { FaqAccordion } from '@/components/ui/faq-accordion';
import { HOME_FAQ_ITEMS } from './content';

export function HomeFaq() {
  return (
    <section className="bg-white py-20 max-[900px]:py-16 max-[640px]:py-[50px]">
      <div className="container grid grid-cols-[minmax(0,0.85fr)_minmax(0,1.5fr)] items-stretch gap-[clamp(36px,7vw,100px)] max-[640px]:grid-cols-1 max-[640px]:gap-[30px]">
        <div className="flex flex-col justify-between gap-16 max-[640px]:contents">
          <div className="max-[640px]:row-start-1">
            <p className="mb-5 flex items-center gap-[9px] text-[11px] font-semibold tracking-[0.08em]">
              <span aria-hidden="true" className="size-1.5 rounded-full bg-[#196dcc]" /> FAQ
            </p>
            <h2 className="max-w-[390px] text-[clamp(30px,3.2vw,43px)] font-medium leading-[1.2] tracking-[-0.035em] max-[640px]:max-w-[330px] max-[640px]:text-[32px]">
              Pertanyaan yang sering diajukan
            </h2>
          </div>
          <div className="max-[640px]:row-start-3">
            <h3 className="text-[17px] font-semibold">Masih punya pertanyaan?</h3>
            <p className="mt-2 max-w-[345px] text-sm leading-[1.85] text-[#647386]">
              Temukan panduan untuk menjelajahi program, layanan, dan fitur HAKKITA.
            </p>
            <Link
              className="mt-[22px] inline-flex min-h-11 items-center gap-2 rounded-[7px] bg-[#196dcc] px-4 text-[13px] font-semibold text-white"
              href="/bantuan"
            >
              Pusat Bantuan <ArrowRight size={18} />
            </Link>
          </div>
        </div>
        <div className="max-[640px]:row-start-2">
          <FaqAccordion items={HOME_FAQ_ITEMS} />
        </div>
      </div>
    </section>
  );
}
