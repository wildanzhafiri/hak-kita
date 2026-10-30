import Image from 'next/image';
import { Asterisk, Quote } from 'lucide-react';
import { SectionHead } from '@/components/ui/section-head';
import { PHOTOS } from '@/config/photos';
import { HOW_IT_WORKS_STEPS } from './content';

export function HowItWorks() {
  return (
    <section className="section container how-section">
      <div className="how-visual">
        <Image
          src={PHOTOS.community}
          alt="Orang-orang berkumpul dan berkontribusi dalam kegiatan komunitas"
          width={900}
          height={1100}
          unoptimized
        />
        <div className="quote-card">
          <Quote size={25} />
          <p>
            Informasi yang tepat.
            <br />
            Langkah yang lebih mantap.
          </p>
          <span>HAK KITA, UNTUK KITA.</span>
        </div>
        <Asterisk className="how-star" size={95} />
      </div>
      <div className="how-copy">
        <SectionHead
          eyebrow="CARA KERJA HAKKITA"
          title="Dari mencari informasi, sampai tahu langkah berikutnya."
        />
        <div className="steps">
          {HOW_IT_WORKS_STEPS.map(({ title, body }, i) => (
            <div className="step" key={title}>
              <span>0{i + 1}</span>
              <div>
                <h4>{title}</h4>
                <p>{body}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
