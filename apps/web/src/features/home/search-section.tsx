import Link from 'next/link';
import { ArrowRight, ArrowUpRight } from 'lucide-react';
import { SearchBar } from '@/components/ui/search-bar';
import { searchHref } from '@/config/routes';
import { POPULAR_SEARCHES } from './content';

export function SearchSection() {
  return (
    <section className="container border-0 pt-7 pb-[42px]">
      <div className="mx-auto grid max-w-[920px] grid-cols-[0.75fr_1.25fr] items-center gap-6 rounded-xl px-[22px] py-3.5 shadow-[0_8px_30px_#17395b0a] max-[760px]:grid-cols-1 max-[760px]:gap-3 max-[760px]:p-4">
        <div className="flex flex-col">
          <strong className="text-[15px]">Mulai dari yang kamu cari.</strong>
          <span className="text-xs">Ada banyak jalan untuk melangkah maju.</span>
        </div>
        <SearchBar
          inputLabel="Cari program atau layanan"
          placeholder="Cari program atau layanan..."
          submitIcon={<ArrowRight size={20} />}
        />
      </div>
      <div className="mx-auto mt-3.5 flex max-w-[920px] flex-wrap items-center gap-2 text-[11px] max-[760px]:gap-[7px]">
        <span>Sering dicari:</span>
        {POPULAR_SEARCHES.map(({ label, keyword }) => (
          <Link
            className="inline-flex items-center gap-1.5 rounded-full bg-white px-2.5 py-[5px] text-[var(--muted)]"
            href={searchHref(keyword)}
            key={keyword}
          >
            {label}
            <ArrowUpRight size={12} />
          </Link>
        ))}
      </div>
    </section>
  );
}
