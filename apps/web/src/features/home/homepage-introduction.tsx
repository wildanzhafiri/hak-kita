import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { HOME_CONTAINER_CLASSES, HOME_HEADING_CLASSES } from './constants';

const HALO_CLASSES =
  "relative isolate mx-auto mb-[30px] max-w-[780px] text-center before:pointer-events-none before:absolute before:-inset-x-3 before:-bottom-6 before:-top-10 before:-z-10 before:opacity-40 before:blur-[28px] before:content-[''] before:[background:radial-gradient(ellipse_at_28%_40%,#a8cef5b3_0%,#c9e1fa66_35%,transparent_65%),radial-gradient(ellipse_at_74%_48%,#f6d7b899_0%,#fbe9d866_35%,transparent_68%)]";

const FEATURE_CLASSES =
  'flex min-w-0 flex-col overflow-hidden rounded-[14px] border p-6 transition-[border-color,box-shadow,transform] duration-[160ms] hover:-translate-y-0.5 hover:shadow-[0_8px_22px_rgb(37_48_68_/_8%)] focus-within:-translate-y-0.5 focus-within:shadow-[0_8px_22px_rgb(37_48_68_/_8%)] motion-reduce:transform-none motion-reduce:transition-none';

const FEATURE_LINK_CLASSES =
  'mt-3.5 inline-flex min-h-[30px] w-fit items-center gap-2.5 text-[13px] font-semibold text-[#196dcc] hover:underline';

export function HomepageIntroduction() {
  return (
    <section className="bg-white py-16 max-[900px]:py-16 max-[640px]:py-11">
      <div className={HOME_CONTAINER_CLASSES}>
        <div className={HALO_CLASSES}>
          <p className="mb-3.5 text-[11px] font-semibold tracking-[0.12em] text-[#196dcc]">
            MENGENAL HAKKITA
          </p>
          <h2
            className={`mx-auto mb-[18px] max-w-[720px] [text-wrap:balance] ${HOME_HEADING_CLASSES}`}
          >
            Lebih Mudah Menemukan Informasi,{' '}
            <span className="text-[#196dcc]">Lebih Jelas Menentukan Langkah.</span>
          </h2>
          <p className="mx-auto max-w-[660px] text-[15px] leading-[1.85] text-[#536477]">
            HAKKITA membantumu mencari program dan layanan publik, memahami persyaratan, serta
            mengetahui langkah yang perlu dilakukan.
          </p>
        </div>
        <div className="mx-auto grid max-w-[920px] grid-cols-2 gap-5 max-[640px]:grid-cols-1">
          <article
            className={`${FEATURE_CLASSES} border-[#cfdded] bg-[linear-gradient(135deg,#f0f6fd_0%,#f8fbff_60%,#fff_100%)] hover:border-[#9dbfe5] focus-within:border-[#9dbfe5]`}
          >
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
            <Link className={FEATURE_LINK_CLASSES} href="/kenali-hakmu">
              Jelajahi Program <ArrowRight size={17} />
            </Link>
          </article>
          <article
            className={`${FEATURE_CLASSES} border-[#e4dbcc] bg-[linear-gradient(135deg,#fffaf4_0%,#fdfcfb_60%,#f5f9fe_100%)] hover:border-[#cbbda7] focus-within:border-[#cbbda7]`}
          >
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
            <Link className={FEATURE_LINK_CLASSES} href="/layanan">
              Lihat Layanan <ArrowRight size={17} />
            </Link>
          </article>
        </div>
      </div>
    </section>
  );
}
