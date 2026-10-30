import Link from 'next/link';
import { ArrowRight, ArrowUpRight } from 'lucide-react';
import { SearchBar } from '@/components/ui/search-bar';
import { searchHref } from '@/config/routes';
import { POPULAR_SEARCHES } from './content';

export function SearchSection() {
  return (
    <section className="container search-section">
      <div className="home-search">
        <div>
          <strong>Mulai dari yang kamu cari.</strong>
          <span>Ada banyak jalan untuk melangkah maju.</span>
        </div>
        <SearchBar
          inputLabel="Cari program atau layanan"
          placeholder="Cari program atau layanan..."
          submitIcon={<ArrowRight size={20} />}
        />
      </div>
      <div className="popular">
        <span>Sering dicari:</span>
        {POPULAR_SEARCHES.map(({ label, keyword }) => (
          <Link href={searchHref(keyword)} key={keyword}>
            {label}
            <ArrowUpRight size={12} />
          </Link>
        ))}
      </div>
    </section>
  );
}
