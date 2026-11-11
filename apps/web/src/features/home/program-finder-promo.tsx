import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { PROGRAM_FINDER_PROMO } from './content';

export function ProgramFinderPromo() {
  return (
    <section
      aria-labelledby="program-finder-promo-title"
      className="bg-white pb-6 pt-9 max-[767px]:pb-[18px] max-[767px]:pt-[26px]"
    >
      <div className="container">
        <div className="flex flex-wrap items-center gap-[18px] rounded-2xl border border-[#cbdcf0] bg-[linear-gradient(105deg,#f2f7ff_0%,#f9fbff_58%,#fffaf2_100%)] px-7 py-[26px] max-[767px]:items-start max-[767px]:gap-3 max-[767px]:p-5">
          <span
            aria-hidden="true"
            className="grid size-[60px] shrink-0 place-items-center rounded-[13px] bg-[#edf5ff] max-[767px]:size-[50px]"
          >
            <Image
              alt=""
              className="size-12 object-contain max-[767px]:size-[42px]"
              height={48}
              src="/program-finder-icon.png"
              width={48}
            />
          </span>
          <div className="min-w-0 flex-1 max-[767px]:basis-full">
            <h2
              className="m-0 text-[19px] font-semibold leading-[1.35] text-[#253044] max-[767px]:text-[17px]"
              id="program-finder-promo-title"
            >
              {PROGRAM_FINDER_PROMO.title}
            </h2>
            <p className="mb-0 mt-1.5 text-sm leading-[1.55] text-[#475569]">
              {PROGRAM_FINDER_PROMO.description}
            </p>
          </div>
          <Link
            className="inline-flex min-h-[46px] items-center justify-center gap-2 rounded-lg bg-[#196dcc] px-6 text-[15px] font-semibold text-white transition-colors hover:bg-[#1458a3] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#196dcc] motion-reduce:transition-none max-[767px]:w-full"
            href="/kenali-hakmu/rekomendasi"
          >
            {PROGRAM_FINDER_PROMO.action}
            <ArrowRight aria-hidden="true" size={18} />
          </Link>
        </div>
      </div>
    </section>
  );
}
