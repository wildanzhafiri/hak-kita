import type { LucideIcon } from 'lucide-react';
import type { Program, Wilayah } from '@hakkita/schema';

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
  wilayah: Wilayah[];
  builtOn: string;
}
