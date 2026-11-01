import { Sparkles } from 'lucide-react';
import { ButtonLink } from '@/components/ui/button-link';
import { Eyebrow } from '@/components/ui/eyebrow';

export function ClosingBanner() {
  return (
    <section className="container closing-wrap">
      <div className="closing">
        <div>
          <Eyebrow marker={false}>LANGKAHMU BERARTI</Eyebrow>
          <h2>Mulai dari kebutuhanmu hari ini.</h2>
          <p>Satu tempat untuk mencari tahu. Banyak jalan untuk maju.</p>
        </div>
        <ButtonLink href="/program">Jelajahi program</ButtonLink>
        <Sparkles className="closing-spark" size={110} />
      </div>
    </section>
  );
}
