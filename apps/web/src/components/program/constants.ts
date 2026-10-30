import {
  BadgeCheck,
  BriefcaseBusiness,
  CircleAlert,
  CircleCheck,
  Files,
  GraduationCap,
  HeartHandshake,
  HeartPulse,
} from 'lucide-react';
import type { Kategori, TingkatVerifikasi } from '@hakkita/schema';
import type { KategoriStyle, VerifikasiStyle } from './types';

export const KATEGORI_STYLE: Record<Kategori, KategoriStyle> = {
  Pendidikan: { icon: GraduationCap, tone: 'mint' },
  Beasiswa: { icon: GraduationCap, tone: 'mint' },
  Kesehatan: { icon: HeartPulse, tone: 'mint' },
  'Bantuan Sosial': { icon: HeartHandshake, tone: 'mint' },
  'Pangan & Gizi': { icon: HeartHandshake, tone: 'mint' },
  'Pekerjaan & Pelatihan': { icon: BriefcaseBusiness, tone: 'peach' },
  'Usaha & UMKM': { icon: BriefcaseBusiness, tone: 'peach' },
  Perumahan: { icon: HeartHandshake, tone: 'peach' },
  'Pertanian & Perikanan': { icon: HeartHandshake, tone: 'peach' },
  'Layanan Administrasi': { icon: Files, tone: 'peach' },
};

export const VERIFIKASI_STYLE: Record<TingkatVerifikasi, VerifikasiStyle> = {
  lengkap: { label: 'Terverifikasi lengkap', icon: BadgeCheck },
  dasar: { label: 'Terverifikasi dasar', icon: CircleCheck },
  belum: { label: 'Belum diverifikasi', icon: CircleAlert },
};
