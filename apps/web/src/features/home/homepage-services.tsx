import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { HOME_CONTAINER_CLASSES, HOME_HEADING_CLASSES } from './constants';
import { HomepageServiceCard } from './homepage-service-card';
import type { HomepageServicesProps } from './types';

export function HomepageServices({ services }: HomepageServicesProps) {
  return (
    <section className="bg-[#f5f8fc] py-20 max-[900px]:py-16 max-[640px]:py-[50px]">
      <div className={HOME_CONTAINER_CLASSES}>
        <div className="mb-[42px] text-center max-[640px]:mb-[26px]">
          <h2 className={`${HOME_HEADING_CLASSES} text-center`}>Ada Keperluan yang Ingin Diurus?</h2>
          <p className="mx-auto mt-2.5 text-[15px] text-[#687385]">
            Temukan panduan persyaratan dan langkah pengurusan berbagai layanan publik.
          </p>
        </div>
        <p className="mb-[18px] text-[11px] font-semibold tracking-[0.1em] text-[#687385]">
          LAYANAN PILIHAN
        </p>
        {services.length > 0 ? (
          <div className="grid auto-rows-fr grid-cols-3 gap-4! max-[1023px]:grid-cols-2 max-[639px]:grid-cols-1 max-[639px]:gap-3.5!">
            {services.map((program) => (
              <HomepageServiceCard key={program.id} program={program} />
            ))}
          </div>
        ) : (
          <p className="rounded-[10px] border border-[#dfe6ef] bg-white p-5 text-sm text-[#687385]">
            Panduan layanan sedang disiapkan.
          </p>
        )}
        <div className="mt-[30px] flex flex-wrap items-center justify-between gap-6 border-t border-[#e1e7ee] pt-[26px] max-[639px]:mt-7 max-[639px]:flex-col max-[639px]:items-start max-[639px]:gap-[18px] max-[639px]:pt-6">
          <div>
            <h3 className="mb-1.5 text-[17px] font-semibold capitalize leading-[1.5]">
              Belum menemukan layanan yang kamu cari?
            </h3>
            <p className="m-0 text-sm leading-[1.7] text-[#687385]">
              Jelajahi panduan yang tersedia.
            </p>
          </div>
          <Link
            className="inline-flex min-h-11 shrink-0 items-center gap-2.5 rounded-[7px] border border-[#c8d5e3] bg-white px-4 text-[13px] font-semibold text-[#196dcc] hover:bg-[#f0f6fd]"
            href="/layanan"
          >
            Lihat kategori layanan <ArrowRight size={18} />
          </Link>
        </div>
      </div>
    </section>
  );
}
