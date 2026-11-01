import Image from 'next/image';
import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';

export function TransparencyPreview() {
  return (
    <section className="bg-white py-20 max-[900px]:py-16 max-[640px]:py-[50px]">
      <div className="container grid grid-cols-[minmax(0,1.85fr)_minmax(0,1fr)] items-center gap-12 rounded-[18px] border border-[#d8e4f2] bg-[var(--blue-pale)] px-10 py-[38px] max-[1023px]:gap-8 max-[1023px]:px-8 max-[800px]:grid-cols-1 max-[800px]:gap-[22px] max-[640px]:gap-5 max-[640px]:px-6 max-[640px]:py-8">
        <div className="flex min-w-0 items-center gap-5 max-[640px]:gap-3">
          <Image
            src="/transparency-review.png"
            alt=""
            width={112}
            height={112}
            className="!h-24 !w-24 flex-none object-contain max-[640px]:!h-[72px] max-[640px]:!w-[72px]"
          />
          <div>
            <h2 className="m-0 max-w-[440px] text-[28px] font-bold leading-[1.27] tracking-[-0.025em] text-[#21599f] max-[640px]:text-[24px]">
              Ketahui Sumber Informasi dan Anggaran Publik
            </h2>
            <p className="mt-3.5 mb-0 max-w-[420px] text-[15px] leading-[1.65] text-[#687385] max-[640px]:text-[13px]">
              Periksa rujukan informasi program dan layanan, lalu telusuri ringkasan APBN dan data
              APBD dari sumber resmi.
            </p>
          </div>
        </div>
        <nav className="min-w-0" aria-label="Sumber informasi dan anggaran">
          <Link
            className="flex min-h-[52px] items-center justify-between gap-4 py-[15px] text-[15px] font-semibold text-[#196dcc]"
            href="/sumber-data"
          >
            Tentang sumber informasi <ArrowUpRight className="shrink-0" size={20} />
          </Link>
          <Link
            className="flex min-h-[52px] items-center justify-between gap-4 border-t border-[#dce4ee] py-[15px] text-[15px] font-semibold text-[#196dcc]"
            href="/anggaran"
          >
            Telusuri anggaran <ArrowUpRight className="shrink-0" size={20} />
          </Link>
        </nav>
      </div>
    </section>
  );
}
