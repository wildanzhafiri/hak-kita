import Image from 'next/image';
import { ArrowUpRight, Asterisk, Check, Grip, Heart, ShieldCheck, UserRound } from 'lucide-react';
import { PHOTOS } from '@/config/photos';

const AVATAR_COUNT = 3;

export function HeroArt() {
  return (
    <div className="hero-art">
      <div className="hero-blob" />
      <Asterisk className="decor-star" size={71} />
      <div className="hero-photo">
        <Image
          src={PHOTOS.hero}
          alt="Sekelompok anak muda belajar dan berdiskusi bersama di luar ruangan"
          width={1200}
          height={1400}
          loading="eager"
          fetchPriority="high"
          unoptimized
        />
        <div className="photo-shade" />
        <div className="photo-caption">
          <span>UNTUK SETIAP LANGKAHMU</span>
          <h3>
            Kesempatan baik,
            <br />
            dimulai dari tahu.
          </h3>
        </div>
      </div>
      <div className="floating-card float-top">
        <span className="float-icon">
          <ShieldCheck size={22} />
        </span>
        <div>
          <strong>Hakmu, lebih dekat.</strong>
          <small>Informasi yang membantumu maju</small>
        </div>
        <span className="mini-check">
          <Check size={12} />
        </span>
      </div>
      <div className="floating-card float-bottom">
        <div className="people-dots">
          {Array.from({ length: AVATAR_COUNT }, (_, i) => (
            <span key={i}>
              <UserRound size={16} />
            </span>
          ))}
        </div>
        <div>
          <strong>Bersama, lebih berdaya.</strong>
          <small>Satu ruang untuk kebutuhan kita.</small>
        </div>
        <Heart size={18} color="var(--orange)" />
      </div>
      <div className="round-stamp">
        HAK KITA
        <span>
          <ArrowUpRight size={40} strokeWidth={1.5} />
        </span>
        MASA DEPAN KITA
      </div>
      <Grip className="decor-dots" size={56} />
    </div>
  );
}
