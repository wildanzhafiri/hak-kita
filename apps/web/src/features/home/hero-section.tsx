import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { SearchBar } from '@/components/ui/search-bar';
import { searchHref } from '@/config/routes';
import type { HeroSectionProps } from './types';
import { HeroArt } from './hero-art';

export function HeroSection({ programs }: HeroSectionProps) {
  const featuredPrograms = programs.slice(0, 4);

  return (
    <section className="overflow-hidden bg-[linear-gradient(180deg,#edf6ff_0%,#f5faff_55%,#fff_100%)] text-center">
      <div className="container relative z-10 pt-[62px] max-[640px]:pt-10">
        <h1 className="mx-auto max-w-[900px] text-[40px] font-bold leading-[1.17] tracking-[-0.025em] text-[#292929] [text-wrap:balance] max-[640px]:text-[clamp(1.875rem,6.6vw,2.375rem)]">
          Informasi <span className="text-[#1769c2]">Program</span> dan{' '}
          <span className="text-[#1769c2]">Panduan Layanan</span> Publik dalam Satu Tempat
        </h1>
        <p className="mx-auto mt-6 max-w-[620px] text-[clamp(1rem,1.35vw,1.125rem)] leading-[1.65] text-[#687385] max-[640px]:mt-5 max-[640px]:text-base max-[640px]:leading-[1.6]">
          Jelajahi bantuan, beasiswa, peluang karier, dan berbagai program pemerintah Indonesia yang
          relevan untukmu.
        </p>
        <SearchBar
          inputLabel="Cari program atau layanan"
          placeholder="Cari program, bantuan, atau layanan publik..."
          submitIcon={null}
          submitLabel="Cari"
          className="mx-auto mt-7 max-w-[800px] shadow-[0_4px_18px_#1b324306]"
        />
        <div className="mx-auto mt-5 flex max-w-[900px] flex-wrap items-center justify-center gap-2.5 text-xs max-[640px]:gap-2">
          <span className="mr-0.5 text-[#78818c]">Paling sering dicari</span>
          {featuredPrograms.map((program) => (
            <Link
              className="inline-flex items-center gap-3 rounded-md border border-[var(--border)] bg-white px-3.5 py-2 text-[#414a55] hover:border-[#196dcc] hover:text-[#196dcc]"
              href={searchHref(program.nama)}
              key={program.id}
            >
              {program.nama}
              <ArrowRight className="text-[#196dcc]" size={14} />
            </Link>
          ))}
        </div>
      </div>
      <HeroArt />
    </section>
  );
}
