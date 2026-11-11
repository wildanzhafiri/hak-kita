import type { PreferensiProfil, Program } from '@hakkita/schema';

export interface FeaturedProgramsProps {
  programs: Program[];
}

export interface HeroSectionProps {
  programs: Program[];
}

export interface HomepageServicesProps {
  services: Program[];
}

export interface ServiceCardProps {
  program: Program;
}

export type HomePersonalizationMode = 'guest' | 'incomplete' | 'ready';

export interface HomePersonalizationProps {
  mode: HomePersonalizationMode;
}

export interface PersonalPicks {
  userId: string;
  preferensi: PreferensiProfil;
  programs: Program[];
}
