import type { Program } from '@hakkita/schema';

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
