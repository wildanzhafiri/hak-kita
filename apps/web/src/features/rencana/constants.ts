import { Bookmark, CalendarClock, FileCheck, LayoutDashboard } from 'lucide-react';
import type { RencanaNavItem } from './types';

export const RENCANA_NAV: readonly RencanaNavItem[] = [
  { href: '/rencanaku', label: 'Ringkasan', icon: LayoutDashboard, count: null },
  { href: '/rencanaku/berkas', label: 'Berkas', icon: FileCheck, count: 'berkas' },
  { href: '/rencanaku/tersimpan', label: 'Tersimpan', icon: Bookmark, count: 'tersimpan' },
  { href: '/rencanaku/tenggat', label: 'Tenggat', icon: CalendarClock, count: 'tenggat' },
];

export const SUMMARY_PREVIEW_COUNT = 3;

export const URGENT_DAYS = 7;

export const PROGRESS_NOTE =
  'Persentase hanya menghitung dokumen yang kamu centang sendiri. Ini bukan status pengajuan di sistem pemerintah.';

export const DEADLINE_NOTE =
  'Tanggal berasal dari data resmi yang kami periksa, bukan dari sistem pemerintah. Cek kanal resmi untuk tenggat terbaru.';

export const UNANSWERED_NOTE = 'Jawabanmu belum lengkap, jadi jumlah dokumen masih bisa bertambah.';

export const COMPLETE_NOTE = 'Semua dokumen siap. Lanjutkan lewat kanal resmi penyelenggara.';
