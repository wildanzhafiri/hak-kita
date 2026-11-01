import Link from 'next/link';
import Image from 'next/image';
import { ChevronRight } from 'lucide-react';
import { searchHref } from '@/config/routes';
import { PROGRAM_CATEGORY_CARDS } from './content';

export function ProgramCategories() {
  return (
    <section className="bg-[#f5f8fc] py-20 max-[900px]:py-16 max-[640px]:py-[50px]">
      <div className="container">
        <div className="mb-[42px] flex items-end justify-between gap-6 max-[640px]:mb-[26px] max-[640px]:flex-wrap">
          <div>
            <h2 className="text-[clamp(26px,3vw,36px)] font-bold tracking-[-0.035em]">
              Temukan Program yang Kamu Butuhkan
            </h2>
            <p className="mt-2.5 text-[15px] text-[#687385]">
              Jelajahi berbagai kategori bantuan dan kesempatan sesuai kebutuhanmu.
            </p>
          </div>
          <Link
            className="inline-flex shrink-0 items-center gap-2.5 text-sm font-semibold text-[#196dcc]"
            href="/program"
          >
            Lihat Semua Program <ChevronRight size={19} />
          </Link>
        </div>
        <div className="grid grid-cols-3 gap-4 max-[900px]:grid-cols-2 max-[640px]:grid-cols-1">
          {PROGRAM_CATEGORY_CARDS.map((category) => {
            return (
              <Link
                className="group flex min-h-[118px] items-center justify-between gap-4 rounded-xl border border-[#e0e6ee] bg-white px-5 py-4 transition-[border-color,box-shadow,transform] duration-200 hover:-translate-y-0.5 hover:border-[#bdd4f0] hover:shadow-[0_8px_22px_rgba(23,57,91,0.06)] motion-reduce:transform-none motion-reduce:transition-none"
                href={searchHref(category.filter)}
                key={category.label}
              >
                <span className="flex min-w-0 items-center gap-4">
                  <span className="grid size-14 shrink-0 place-items-center">
                    <Image
                      className="h-full w-full object-contain"
                      src={category.image}
                      alt=""
                      width={56}
                      height={56}
                    />
                  </span>
                  <span className="text-[15px] font-semibold leading-[1.5] tracking-[-0.015em] text-[#263347] max-[900px]:text-sm">
                    {category.label}
                  </span>
                </span>
                <span className="grid size-[30px] shrink-0 place-items-center rounded-full border border-[#d8e4f2] bg-white text-[#196dcc]">
                  <ChevronRight
                    className="transition-transform duration-[180ms] ease-out group-hover:translate-x-0.5 motion-reduce:transition-none"
                    size={16}
                  />
                </span>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
