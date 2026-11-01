import Link from 'next/link';
import { ArrowUpRight, BookOpen, Heart } from 'lucide-react';
import { SECTIONS } from '@/config/sections';
import { SectionHead } from '@/components/ui/section-head';

function BenefitTags() {
  return (
    <div className="benefit-tags">
      <span>
        <BookOpen size={13} /> Pendidikan
      </span>
      <span>
        <Heart size={13} /> Kesehatan
      </span>
      <span>+ Lainnya</span>
    </div>
  );
}

export function SectionsGrid() {
  return (
    <section className="section container" id="layanan">
      <SectionHead
        eyebrow="MULAI DARI KEBUTUHANMU"
        title="Apa yang ingin kamu lakukan?"
        description="Langkah kecil hari ini, untuk peluang yang lebih baik."
      />
      <div className="bento-grid">
        {SECTIONS.map(({ slug, nama, deskripsi, cta, warna, icon: Icon }, i) => (
          <Link href={`/${slug}`} className={`bento-card ${warna} bento-${i}`} key={slug}>
            <div className="bento-top">
              <span className="bento-icon">
                <Icon size={29} strokeWidth={1.5} />
              </span>
              <span className="card-number">0{i + 1}</span>
            </div>
            <div>
              <h3>{nama}</h3>
              <p>{deskripsi}</p>
            </div>
            {slug === 'program' && <BenefitTags />}
            <span className="bento-cta">
              {cta}
              <span>
                <ArrowUpRight size={18} />
              </span>
            </span>
          </Link>
        ))}
      </div>
    </section>
  );
}
