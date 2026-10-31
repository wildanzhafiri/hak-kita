import Link from 'next/link';
import { ArrowLeft, ChevronRight } from 'lucide-react';
import type { RencanaHeaderProps } from './types';

export function RencanaHeader({ section }: RencanaHeaderProps) {
  return (
    <header className="rencana-header">
      <div className="rencana-header-location">
        <span>Rencanaku</span>
        <ChevronRight size={15} />
        <strong>{section}</strong>
      </div>
      <Link className="rencana-back" href="/">
        <ArrowLeft size={17} />
        Kembali ke Beranda
      </Link>
    </header>
  );
}
