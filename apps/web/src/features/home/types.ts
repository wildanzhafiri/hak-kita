import type { LucideIcon } from 'lucide-react';
import type { Program } from '@hakkita/schema';

export interface TitledText {
  title: string;
  body: string;
}

export interface TrustItem extends TitledText {
  icon: LucideIcon;
}

export interface PopularSearch {
  label: string;
  keyword: string;
}

export interface FeaturedProgramsProps {
  programs: Program[];
}

export interface HeroSectionProps {
  programs: Program[];
}

export interface HomepageServicesProps {
  programs: Program[];
}

export interface ServiceCardProps {
  program: Program;
}
