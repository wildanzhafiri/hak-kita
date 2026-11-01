import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

export function HomepageIntroduction() {
  return (
    <section className="bg-white py-16 max-[640px]:py-11">
      <div className="container">
        <div className="mx-auto mb-[30px] max-w-[780px] text-center">
          <p className="mb-3.5 text-[11px] font-semibold tracking-[0.12em] text-[#196dcc]">
            MENGENAL HAKKITA
          </p>
          <h2 className="mx-auto mb-[18px] max-w-[720px] text-[clamp(27px,2.5vw,34px)] font-bold leading-[1.35] tracking-[-0.025em] [text-wrap:balance]">
            Lebih Mudah Menemukan Informasi,{' '}
            <span className="text-[#196dcc]">Lebih Jelas Menentukan Langkah.</span>
          </h2>
          <p className="mx-auto max-w-[660px] text-[15px] leading-[1.85] text-[#536477]">
            HAKKITA membantumu mencari program dan layanan publik, memahami persyaratan, serta
            mengetahui langkah yang perlu dilakukan.
          </p>
        </div>
        <div className="mx-auto grid max-w-[920px] grid-cols-2 gap-5 max-[640px]:grid-cols-1">
          <article className="flex min-w-0 flex-col overflow-hidden rounded-[14px] border border-[#e0e8f2] bg-[linear-gradient(135deg,#f0f6fd_0%,#f8fbff_60%,#fff_100%)] p-6">
            <span className="mb-3.5 inline-flex w-fit items-center rounded-full border border-[#cbdcf0] bg-white/70 px-2.5 py-[5px] text-[10px] font-semibold tracking-[0.08em] text-[#196dcc]">
              PROGRAM &amp; KESEMPATAN
            </span>
            <h3 className="mb-2.5 text-[25px] font-semibold leading-[1.3] tracking-[-0.025em]">
              Kenali Hakmu
            </h3>
            <p className="max-w-[410px] text-sm leading-[1.7] text-[#536477]">
              Temukan informasi bantuan, beasiswa, peluang karier, dan berbagai program yang sesuai
              dengan kebutuhanmu.
            </p>
            <Link
              className="mt-3.5 inline-flex min-h-[30px] w-fit items-center gap-2.5 text-[13px] font-semibold text-[#196dcc]"
              href="/program"
            >
              Jelajahi Program <ArrowRight size={17} />
            </Link>
          </article>
          <article className="flex min-w-0 flex-col overflow-hidden rounded-[14px] border border-[#ebe5db] bg-[linear-gradient(135deg,#fffaf4_0%,#fdfcfb_60%,#f5f9fe_100%)] p-6">
            <span className="mb-3.5 inline-flex w-fit items-center rounded-full border border-[#e5dccf] bg-white/70 px-2.5 py-[5px] text-[10px] font-semibold tracking-[0.08em] text-[#8a643e]">
              PANDUAN PENGURUSAN
            </span>
            <h3 className="mb-2.5 text-[25px] font-semibold leading-[1.3] tracking-[-0.025em]">
              Layanan Publik
            </h3>
            <p className="max-w-[410px] text-sm leading-[1.7] text-[#536477]">
              Ketahui persyaratan, prosedur, dan cara mengurus layanan publik melalui panduan yang
              tersedia.
            </p>
            <Link
              className="mt-3.5 inline-flex min-h-[30px] w-fit items-center gap-2.5 text-[13px] font-semibold text-[#196dcc]"
              href="/layanan"
            >
              Lihat Layanan <ArrowRight size={17} />
            </Link>
          </article>
        </div>
      </div>
    </section>
  );
}
