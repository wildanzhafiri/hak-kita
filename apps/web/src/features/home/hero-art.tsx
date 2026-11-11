import Image from 'next/image';
import { PHOTOS } from '@/config/photos';

export function HeroArt() {
  return (
    <Image
      src={PHOTOS.hero}
      alt="Keluarga, pesepeda, dan warga di taman tepi danau dengan panorama kota Indonesia"
      width={2168}
      height={537}
      loading="eager"
      fetchPriority="high"
      className="mt-[14px] block h-auto w-full object-cover object-bottom max-[640px]:-ml-[25%] max-[640px]:mt-[9px] max-[640px]:w-[150%] max-[640px]:max-w-none"
    />
  );
}
