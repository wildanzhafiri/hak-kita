import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { isLayanan } from '@hakkita/domain';
import { HomepageServiceCard } from './homepage-service-card';
import type { HomepageServicesProps } from './types';

export function HomepageServices({ programs }: HomepageServicesProps) {
  const services = programs.filter(isLayanan);

  return (
    <section className="bg-[#f5f8fc] py-20 max-[900px]:py-16 max-[640px]:py-[50px]">
      <div className="container">
        <div className="mb-[30px] max-[640px]:mb-[26px]">
          <h2 className="text-[clamp(26px,3vw,36px)] font-bold tracking-[-0.035em]">
            Ada Keperluan yang Ingin Diurus?
          </h2>
          <p className="mt-2.5 text-[15px] text-[#687385]">
            Temukan panduan persyaratan dan langkah pengurusan berbagai layanan publik.
          </p>
        </div>
        <p className="mb-3 text-[11px] font-semibold tracking-[0.1em] text-[#687385]">
          LAYANAN PILIHAN
        </p>
        {services.length > 0 ? (
          <div className="grid grid-cols-3 gap-4 max-[900px]:grid-cols-2 max-[640px]:grid-cols-1">
            {services.map((program) => (
              <HomepageServiceCard key={program.id} program={program} />
            ))}
          </div>
        ) : (
          <p className="rounded-[10px] border border-[#dfe6ef] bg-white p-5 text-sm text-[#687385]">
            Panduan layanan sedang disiapkan.
          </p>
        )}
        <div className="mt-7 flex flex-wrap items-center justify-between gap-5 border-t border-[#dce1e6] pt-5">
          <div>
            <h3 className="text-base font-semibold">Belum menemukan layanan yang kamu cari?</h3>
            <p className="mt-1 text-[13px] text-[#687385]">Jelajahi panduan yang tersedia.</p>
          </div>
          <Link
            className="inline-flex min-h-11 items-center gap-2 rounded-[7px] border border-[#c8d5e3] bg-white px-4 text-[13px] font-semibold text-[#196dcc]"
            href="/layanan"
          >
            Lihat kategori layanan <ArrowRight size={18} />
          </Link>
        </div>
      </div>
    </section>
  );
}
