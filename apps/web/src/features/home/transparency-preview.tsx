import Image from 'next/image';
import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';
import { TRANSPARENCY_PREVIEW } from './content';

const LINK_CLASSES =
  'group flex min-h-[52px] items-center justify-between gap-4 py-[15px] text-[15px] font-semibold leading-normal text-[#196dcc] hover:text-[#1458a3] focus-visible:rounded-[3px] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#196dcc]';

const ARROW_CLASSES =
  'shrink-0 transition-transform duration-[180ms] group-hover:-translate-y-0.5 group-hover:translate-x-0.5 motion-reduce:transition-none';

export function TransparencyPreview() {
  return (
    <section
      aria-labelledby="transparency-title"
      className="bg-white py-20 max-[900px]:py-16 max-[640px]:py-[50px]"
    >
      <div className="container grid grid-cols-[minmax(0,1.85fr)_minmax(0,1fr)] items-center gap-12! rounded-[18px] border border-transparent [background:linear-gradient(112deg,#f7f5ef_0%,#f5f6f3_42%,#edf5ff_100%)_padding-box,linear-gradient(112deg,#e8dfcf_0%,#d5deea_48%,#b8cfe9_100%)_border-box] px-8 py-11 shadow-[0_4px_14px_rgba(35,59,85,0.075)] max-[1023px]:gap-8! max-[1023px]:py-10 max-[800px]:grid-cols-1 max-[800px]:gap-[22px]! max-[640px]:gap-5! max-[640px]:px-6 max-[640px]:py-8">
        <div className="grid min-w-0 grid-cols-[96px_minmax(0,1fr)] items-start gap-x-5! gap-y-1! max-[640px]:grid-cols-[72px_minmax(0,1fr)] max-[640px]:gap-x-3!">
          <Image
            alt=""
            className="col-start-1 row-start-1 size-24 self-center object-contain max-[640px]:size-[72px]"
            height={112}
            src="/transparency-review.png"
            width={112}
          />
          <h2
            className="col-start-2 m-0 max-w-[440px] self-center text-balance text-[28px] font-bold leading-[1.27] tracking-[-0.025em] text-[#21599f] max-[640px]:text-[25px]"
            id="transparency-title"
          >
            {TRANSPARENCY_PREVIEW.title}
          </h2>
          <p className="col-start-2 mb-0 mt-0 max-w-[420px] text-[15px] leading-[1.65] text-[#687385] max-[640px]:col-span-2 max-[640px]:col-start-1 max-[640px]:max-w-none">
            {TRANSPARENCY_PREVIEW.description}
          </p>
        </div>
        <nav aria-label="Sumber informasi dan anggaran" className="min-w-0">
          <Link className={LINK_CLASSES} href="/sumber-data">
            {TRANSPARENCY_PREVIEW.sourcesLink}
            <ArrowUpRight aria-hidden="true" className={ARROW_CLASSES} size={20} />
          </Link>
          <Link className={`${LINK_CLASSES} border-t border-[#dce4ee]`} href="/anggaran">
            {TRANSPARENCY_PREVIEW.budgetLink}
            <ArrowUpRight aria-hidden="true" className={ARROW_CLASSES} size={20} />
          </Link>
        </nav>
      </div>
    </section>
  );
}
