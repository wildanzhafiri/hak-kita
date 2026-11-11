import Link from 'next/link';
import { Globe } from 'lucide-react';
import { Logo } from './logo';

const footerLinkClassName =
  'mb-3 text-[12px] text-[#59616b] hover:text-[#196dcc] max-[900px]:mb-0 max-[900px]:flex max-[900px]:min-h-11 max-[900px]:items-center';

export function Footer() {
  return (
    <footer className="border-t border-[#e4e8ee] bg-[#f7f8fa] pt-0">
      <div className="container grid grid-cols-[1.5fr_1fr_1fr_1fr] gap-8 py-10 max-[900px]:grid-cols-2 max-[900px]:gap-x-6 max-[900px]:gap-y-8 max-[900px]:py-8 max-[520px]:gap-x-5">
        <div className="footer-brand max-w-[260px] max-[900px]:col-span-2">
          <Logo />
          <p className="!text-[13px] !leading-[1.8] text-[#647184]">
            Membuka Akses,
            <br />
            Menuntun Langkah.
          </p>
        </div>
        <div className="flex flex-col items-start">
          <h2 className="mb-[19px] mt-0.5 text-[13px] font-semibold text-[#292b2e] max-[900px]:mb-3.5 max-[900px]:text-xs">
            Jelajahi Hakkita
          </h2>
          <Link className={footerLinkClassName} href="/kenali-hakmu">
            Kenali Hakmu
          </Link>
          <Link className={footerLinkClassName} href="/layanan">
            Layanan Publik
          </Link>
          <Link className={footerLinkClassName} href="/anggaran">
            Telusuri Anggaran
          </Link>
        </div>
        <div className="flex flex-col items-start">
          <h2 className="mb-[19px] mt-0.5 text-[13px] font-semibold text-[#292b2e] max-[900px]:mb-3.5 max-[900px]:text-xs">
            Untuk Kamu
          </h2>
          <Link className={footerLinkClassName} href="/periksa-kondisimu">
            Rekomendasi Untukmu
          </Link>
          <Link className={footerLinkClassName} href="/rencanaku">
            Rencanaku
          </Link>
          <Link className={footerLinkClassName} href="/bantuan">
            FAQ
          </Link>
        </div>
        <div className="flex flex-col items-start">
          <h2 className="mb-[19px] mt-0.5 text-[13px] font-semibold text-[#292b2e] max-[900px]:mb-3.5 max-[900px]:text-xs">
            Tentang Hakkita
          </h2>
          <Link className={footerLinkClassName} href="/tentang">
            Tentang kami
          </Link>
          <Link className={footerLinkClassName} href="/sumber-data">
            Sumber Informasi
          </Link>
          <Link className={footerLinkClassName} href="/tentang#privasi">
            Privasi
          </Link>
        </div>
      </div>
      <div className="container flex min-h-12 items-center justify-between gap-5 border-t border-[#e1e5eb] py-3 text-[10px] text-[#737d89] max-[520px]:flex-wrap max-[520px]:gap-3">
        <span>© 2026 Hakkita.</span>
        <span className="inline-flex items-center gap-[7px] whitespace-nowrap">
          <Globe size={16} /> Bahasa Indonesia
        </span>
      </div>
    </footer>
  );
}
