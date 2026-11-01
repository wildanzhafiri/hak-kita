import type { TipeGerbang } from '@hakkita/schema';
import { CarFront, ContactRound, HeartPulse, Landmark, Plane, type LucideIcon } from 'lucide-react';

export const DEFAULT_SEARCH_PLACEHOLDER = 'Cari program atau layanan...';

export const SERVICE_PRESENTATION: Record<string, { category: string; icon: LucideIcon }> = {
  'akta-kelahiran': { category: 'Kependudukan & Catatan Sipil', icon: ContactRound },
  'kartu-keluarga': { category: 'Kependudukan & Catatan Sipil', icon: ContactRound },
  'ktp-el': { category: 'Kependudukan & Catatan Sipil', icon: ContactRound },
  npwp: { category: 'Pajak & Perpajakan', icon: Landmark },
  'perpanjangan-sim': { category: 'Kendaraan & Transportasi', icon: CarFront },
  'paspor-baru': { category: 'Perjalanan & Keimigrasian', icon: Plane },
  'pendaftaran-jkn': { category: 'Kesehatan & Jaminan Sosial', icon: HeartPulse },
  'sim-baru': { category: 'Kendaraan & Transportasi', icon: CarFront },
};

export const SERVICE_CATEGORY_ICONS: Record<string, LucideIcon> = {
  'Kependudukan & Catatan Sipil': ContactRound,
  'Pajak & Perpajakan': Landmark,
  'Kendaraan & Transportasi': CarFront,
  'Perjalanan & Keimigrasian': Plane,
  'Kesehatan & Jaminan Sosial': HeartPulse,
};

export const SERVICE_QUICK_LINK_ORDER = [
  'ktp-el',
  'npwp',
  'perpanjangan-sim',
  'paspor-baru',
  'kartu-keluarga',
  'akta-kelahiran',
  'pendaftaran-jkn',
  'sim-baru',
] as const;

export const GERBANG_LABEL: Record<TipeGerbang, string> = {
  desil: 'Ditetapkan lewat data pemerintah (desil)',
  kategori: 'Syarat kategori umum',
  prosedur: 'Prosedur administrasi tanpa seleksi',
};

export const DEFAULT_STEPS = [
  'Periksa informasi terbaru melalui kanal resmi.',
  'Siapkan dokumen sesuai ketentuan penyelenggara.',
  'Ikuti alur pengajuan melalui kanal resmi.',
  'Simpan bukti pengurusan dari penyelenggara, jika tersedia.',
] as const;
