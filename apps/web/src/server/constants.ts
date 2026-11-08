export const EMAIL_PREFERENCE_PAGE_SIZE = 100;

export const ASSISTANT_PAGE_LINKS = {
  beranda: { label: 'Beranda', href: '/' },
  program: { label: 'Kenali Hakmu', href: '/program' },
  layanan: { label: 'Layanan Publik', href: '/layanan' },
  anggaran: { label: 'Telusuri Anggaran', href: '/anggaran' },
  rencanaku: { label: 'Rencanaku', href: '/rencanaku' },
  kondisi: { label: 'Periksa Kondisimu', href: '/periksa-kondisimu' },
  bantuan: { label: 'Pusat Bantuan', href: '/bantuan' },
} as const;

export const SOURCE_CHECK_BATCH_SIZE = 4;
export const SOURCE_CHECK_TIMEOUT_MS = 8000;
export const SOURCE_CHECK_MAX_BYTES = 5 * 1024 * 1024;
export const SOURCE_CHECK_MAX_REDIRECTS = 3;

export const EMAIL_CLAIM_TIMEOUT_MS = 20 * 60 * 1000;

export const PROGRAM_EMAIL_LOGO_CONTENT_ID = 'hakkita-logo';

export const PROGRAM_EMAIL_COLORS = {
  background: '#f4f7fb',
  border: '#d7e0eb',
  ink: '#142b49',
  muted: '#536780',
  masthead: '#123f78',
  mastheadText: '#e8f1fb',
  panel: '#edf5ff',
  primary: '#1769c6',
  red: '#d74245',
  surface: '#ffffff',
} as const;
