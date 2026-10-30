import { Eyebrow } from '@/components/ui/eyebrow';
import { TRUST_ITEMS } from './content';

export function TrustSection() {
  return (
    <section className="trust-section container">
      <div>
        <Eyebrow marker={false}>TERBUKA SEJAK AWAL</Eyebrow>
        <h2>
          Informasi yang jelas.
          <br />
          Sumber yang bisa diperiksa.
        </h2>
      </div>
      <div className="trust-items">
        {TRUST_ITEMS.map(({ icon: Icon, title, body }) => (
          <div key={title}>
            <Icon size={22} />
            <h4>{title}</h4>
            <p>{body}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
