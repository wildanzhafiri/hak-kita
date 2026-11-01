import Link from 'next/link';
import { Globe } from 'lucide-react';
import { Logo } from './logo';

export function Footer() {
  return (
    <footer className="border-t border-[#e4e8ee] bg-[#f7f8fa]">
      <div className="container grid grid-cols-4 gap-10 py-[54px] max-[760px]:grid-cols-2 max-[520px]:grid-cols-1 max-[520px]:gap-8 max-[520px]:py-10">
        <div className="max-w-[260px]">
          <Logo />
          <p className="mt-4 text-[13px] leading-6 text-[#647184]">
            Membuka Akses, <br />
            Menuntun Langkah.
          </p>
        </div>
        <div className="flex flex-col items-start gap-3 text-[13px] text-[#536174]">
          <h2 className="mb-1 text-[13px] font-semibold text-[#263347]">Jelajahi HAKKITA</h2>
          <Link className="hover:text-[#196dcc]" href="/program">
            Kenali Hakmu
          </Link>
          <Link className="hover:text-[#196dcc]" href="/layanan">
            Layanan Publik
          </Link>
          <Link className="hover:text-[#196dcc]" href="/anggaran">
            Telusuri Anggaran
          </Link>
        </div>
        <div className="flex flex-col items-start gap-3 text-[13px] text-[#536174]">
          <h2 className="mb-1 text-[13px] font-semibold text-[#263347]">Untuk kamu</h2>
          <Link className="hover:text-[#196dcc]" href="/periksa-kondisimu">
            Periksa Kondisimu
          </Link>
          <Link className="hover:text-[#196dcc]" href="/rencanaku">
            Rencanaku
          </Link>
          <Link className="hover:text-[#196dcc]" href="/bantuan">
            Bantuan
          </Link>
        </div>
        <div className="flex flex-col items-start gap-3 text-[13px] text-[#536174]">
          <h2 className="mb-1 text-[13px] font-semibold text-[#263347]">Tentang HAKKITA</h2>
          <Link className="hover:text-[#196dcc]" href="/tentang">
            Tentang kami
          </Link>
          <Link className="hover:text-[#196dcc]" href="/sumber-data">
            Sumber informasi
          </Link>
          <p className="max-w-[220px] text-[12px] leading-5 text-[#687385]">
            HAKKITA bukan situs pemerintah. Periksa ketentuan melalui kanal resmi.
          </p>
        </div>
      </div>
      <div className="container flex min-h-[64px] items-center justify-between gap-4 border-t border-[#e1e5eb] text-xs text-[#687385] max-[520px]:flex-wrap max-[520px]:py-4">
        <span>© 2026 HAKKITA</span>
        <span className="inline-flex items-center gap-2">
          <Globe size={15} /> Bahasa Indonesia
        </span>
      </div>
    </footer>
  );
}
