import { ChevronDown, Globe } from 'lucide-react';
import { ButtonLink } from '@/components/ui/button-link';
import { Eyebrow } from '@/components/ui/eyebrow';
import { BUDGET_LABELS } from './content';

export function TransparencyPreview() {
  return (
    <section className="container section">
      <div className="transparency-preview">
        <div>
          <Eyebrow light>TRANSPARANSI PUBLIK</Eyebrow>
          <h2>
            Uang publik.
            <br />
            Cerita kita semua.
          </h2>
          <p>
            Pahami ke mana anggaran dialokasikan dan bagaimana realisasinya. Karena keterbukaan
            dimulai dari informasi yang bisa dipahami.
          </p>
          <ButtonLink href="/awasi-uang-publik">Jelajahi anggaran</ButtonLink>
          <span className="preview-note">
            <Globe size={14} /> Lebih terbuka, lebih bermakna.
          </span>
        </div>
        <div className="mini-dashboard">
          <div className="mini-dash-head">
            <span>Cara kami menampilkan anggaran</span>
            <span>
              Label hubungan <ChevronDown size={12} />
            </span>
          </div>
          <span className="data-pill">SUMBER DAN CAKUPAN SELALU TERTERA</span>
          <div className="label-list">
            {BUDGET_LABELS.map(({ title, body }) => (
              <div key={title}>
                <strong>{title}</strong>
                <small>{body}</small>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
