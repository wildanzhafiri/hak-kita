import Link from 'next/link';
import Image from 'next/image';
import { ChevronRight } from 'lucide-react';
import { programCategoryHref } from '@/config/routes';
import {
  HOME_CONTAINER_CLASSES,
  HOME_HEADING_CLASSES,
  HOME_SECTION_LINK_CLASSES,
} from './constants';
import { PROGRAM_CATEGORY_CARDS } from './content';

export function ProgramCategories() {
  return (
    <section className="bg-[#f5f8fc] pb-6 pt-20 max-[900px]:pt-16 max-[767px]:pb-[18px] max-[640px]:pt-[50px]">
      <div className={HOME_CONTAINER_CLASSES}>
        <div className="mb-[42px] flex items-start justify-between gap-6 max-[640px]:mb-[26px] max-[640px]:flex-wrap max-[640px]:gap-4">
          <div>
            <h2 className={HOME_HEADING_CLASSES}>Temukan Program yang Kamu Butuhkan</h2>
            <p className="mt-2.5 text-[15px] text-[#687385]">
              Jelajahi berbagai kategori bantuan dan kesempatan sesuai kebutuhanmu.
            </p>
          </div>
          <Link className={`${HOME_SECTION_LINK_CLASSES} capitalize`} href="/kenali-hakmu">
            Lihat Semua Program <ChevronRight size={19} />
          </Link>
        </div>
        <div className="grid grid-cols-3 gap-3.5! max-[900px]:grid-cols-2 max-[640px]:grid-cols-1 max-[640px]:gap-3!">
          {PROGRAM_CATEGORY_CARDS.map((category) => (
            <Link
              className="group flex min-h-[88px] items-center justify-between gap-3.5 rounded-[14px] border border-[#e3e9f1] bg-white p-[18px] transition-[border-color,box-shadow,transform] duration-200 max-[640px]:min-h-[82px] max-[640px]:p-4 hover:-translate-y-0.5 hover:border-[#bdd4f0] hover:shadow-[0_8px_22px_rgba(23,57,91,0.06)] motion-reduce:transform-none motion-reduce:transition-none"
              href={programCategoryHref(category.filter)}
              key={category.label}
            >
              <span className="flex min-w-0 items-center gap-3">
                <span className="grid size-[60px] shrink-0 place-items-center">
                  <Image
                    alt=""
                    className="h-full w-full object-contain"
                    height={60}
                    src={category.image}
                    width={60}
                  />
                </span>
                <span className="text-[17px] font-semibold leading-[1.5] tracking-[-0.015em] text-[#1b304c]">
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
          ))}
        </div>
      </div>
    </section>
  );
}
