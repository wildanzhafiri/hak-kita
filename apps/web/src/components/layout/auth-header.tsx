import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { Logo } from './logo';

export function AuthHeader() {
  return (
    <header className="border-b border-[#edf0f4] bg-white">
      <div className="container flex min-h-20 items-center justify-between gap-6 max-[640px]:min-h-[68px] max-[640px]:gap-4">
        <Logo />
        <Link
          className="inline-flex items-center gap-2 text-sm font-medium text-[#1769c2] hover:underline max-[640px]:gap-1.5 max-[640px]:text-xs"
          href="/"
        >
          <ArrowLeft aria-hidden="true" size={17} />
          Kembali ke beranda
        </Link>
      </div>
    </header>
  );
}
