import { ClipboardCheck, Files, History } from 'lucide-react';

export const MAIN_NAVIGATION = [
  { href: '/', label: 'Beranda' },
  { href: '/kenali-hakmu', label: 'Kenali Hakmu' },
  { href: '/layanan', label: 'Layanan Publik' },
  { href: '/anggaran', label: 'Telusuri Anggaran' },
] as const;

export const MOBILE_PANEL_CLASSES = {
  base: 'absolute inset-x-0 top-full z-50 max-h-[calc(100dvh-72px)] overflow-y-auto overscroll-contain rounded-b-2xl border-t border-[#e1e7ee] bg-white shadow-[0_14px_28px_#17395b1f] transition-[clip-path,opacity,translate,visibility] duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none [@media(width>=1024px)]:hidden',
  open: 'visible translate-y-0 opacity-100 [clip-path:inset(0_-40px_-60px_-40px)]',
  closed: 'invisible -translate-y-2 opacity-0 [clip-path:inset(0_0_100%_0)]',
} as const;

export const SHEET_ACTION_CLASSES = {
  primary:
    'flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-[#196dcc] text-[15px] font-semibold text-white transition-colors hover:bg-[#1458a3] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#196dcc] motion-reduce:transition-none',
  secondary:
    'flex h-12 w-full items-center justify-center gap-2 rounded-xl border border-[#c7dbf2] bg-white text-[15px] font-semibold text-[#196dcc] transition-colors hover:bg-[#f0f6fd] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#196dcc] motion-reduce:transition-none',
} as const;

export const ADMIN_NAVIGATION_ICONS = {
  clipboard: ClipboardCheck,
  files: Files,
  history: History,
} as const;

export const AUTH_ROUTE_PATHS = [
  '/masuk',
  '/daftar',
  '/lupa-kata-sandi',
  '/atur-kata-sandi',
] as const;

export const FOOTER_HIDDEN_PATHS = [
  '/profil',
  '/profil/edit',
  '/selamat-datang',
  '/kenali-hakmu/rekomendasi',
] as const;
