import type { LucideIcon } from 'lucide-react';

export type SectionColor = 'lime' | 'mint' | 'peach' | 'lavender' | 'dark';

export interface Section {
  slug: string;
  nama: string;
  deskripsi: string;
  cta: string;
  icon: LucideIcon;
  warna: SectionColor;
}
