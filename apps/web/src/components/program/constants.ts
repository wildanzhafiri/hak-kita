import {
  BadgeCheck,
  BriefcaseBusiness,
  CircleAlert,
  CircleCheck,
  Files,
  CarFront,
  ContactRound,
  GraduationCap,
  HeartHandshake,
  HeartPulse,
  House,
  MessageCircle,
  Receipt,
} from 'lucide-react';
import type { Kategori, TingkatVerifikasi } from '@hakkita/schema';
import type { KategoriStyle, VerifikasiStyle } from './types';

export const KATEGORI_IMAGE: Record<Kategori, string> = {
  Pendidikan: '/program-education.png',
  Beasiswa: '/program-education.png',
  Kesehatan: '/program-community.png',
  'Bantuan Sosial': '/program-community.png',
  'Pangan & Gizi': '/program-community.png',
  'Pekerjaan & Pelatihan': '/program-opportunity.png',
  'Usaha & UMKM': '/program-opportunity.png',
  Perumahan: '/program-opportunity.png',
  'Pertanian & Perikanan': '/program-community.png',
  'Kependudukan & Dokumen Pribadi': '/transparency-review.png',
  'Kendaraan & Transportasi': '/transparency-review.png',
  'Kesehatan & Jaminan Sosial': '/transparency-review.png',
  'Pekerjaan & Usaha': '/transparency-review.png',
  Perpajakan: '/transparency-review.png',
  'Pendidikan & Dokumen Akademik': '/transparency-review.png',
  'Pertanahan & Bangunan': '/transparency-review.png',
  'Pengaduan & Informasi Publik': '/transparency-review.png',
  'Layanan Administrasi': '/transparency-review.png',
};

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
  'Kependudukan & Dokumen Pribadi': { icon: ContactRound, tone: 'peach' },
  'Kendaraan & Transportasi': { icon: CarFront, tone: 'peach' },
  'Kesehatan & Jaminan Sosial': { icon: HeartPulse, tone: 'mint' },
  'Pekerjaan & Usaha': { icon: BriefcaseBusiness, tone: 'peach' },
  Perpajakan: { icon: Receipt, tone: 'peach' },
  'Pendidikan & Dokumen Akademik': { icon: GraduationCap, tone: 'mint' },
  'Pertanahan & Bangunan': { icon: House, tone: 'peach' },
  'Pengaduan & Informasi Publik': { icon: MessageCircle, tone: 'mint' },
  'Layanan Administrasi': { icon: Files, tone: 'peach' },
};

export const VERIFIKASI_STYLE: Record<TingkatVerifikasi, VerifikasiStyle> = {
  lengkap: { label: 'Terverifikasi lengkap', icon: BadgeCheck },
  dasar: { label: 'Terverifikasi dasar', icon: CircleCheck },
  belum: { label: 'Belum diverifikasi', icon: CircleAlert },
};
