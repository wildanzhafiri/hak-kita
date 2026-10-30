import { ShieldCheck } from 'lucide-react';
import { ButtonLink } from '@/components/ui/button-link';
import { Eyebrow } from '@/components/ui/eyebrow';
import { HeroArt } from './hero-art';

export function HeroSection() {
  return (
    <section className="hero container">
      <div className="hero-copy">
        <Eyebrow>SATU PORTAL, BERAGAM KEBUTUHAN</Eyebrow>
        <h1>
          Lebih mudah
          <br />
          mengurus <span className="highlight">hak</span>
          <br />
          dan layanan
          <br className="hero-break" /> publik<span className="orange-dot">.</span>
        </h1>
        <p>
          Temukan bantuan, siapkan langkah mengurusnya, dan lihat di mana prosesnya sering
          tersendat, semua dalam satu tempat.
        </p>
        <div className="hero-buttons">
          <ButtonLink href="/kenali-hakmu">Jelajahi layanan</ButtonLink>
          <ButtonLink href="/tentang" secondary>
            Kenali HAKKITA
          </ButtonLink>
        </div>
        <div className="hero-proof">
          <span className="proof-icon">
            <ShieldCheck size={18} />
          </span>
          <span>Sumber resmi. Langkah lebih terarah.</span>
        </div>
      </div>
      <HeroArt />
    </section>
  );
}
