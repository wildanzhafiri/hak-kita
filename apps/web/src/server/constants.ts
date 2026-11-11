export const EMAIL_PREFERENCE_PAGE_SIZE = 100;

export const ASSISTANT_PAGE_LINKS = {
  beranda: { label: 'Beranda', href: '/' },
  program: { label: 'Kenali Hakmu', href: '/kenali-hakmu' },
  layanan: { label: 'Layanan Publik', href: '/layanan' },
  anggaran: { label: 'Telusuri Anggaran', href: '/anggaran' },
  rencanaku: { label: 'Rencanaku', href: '/rencanaku' },
  kondisi: { label: 'Periksa Kondisimu', href: '/periksa-kondisimu' },
  bantuan: { label: 'Pusat Bantuan', href: '/bantuan' },
} as const;

export const RADAR_RUN_FAILURE_MESSAGE =
  'Radar gagal dijalankan. Periksa konfigurasi dan coba lagi.';

export const RADAR_RUN_STREAM_HEADERS = {
  'Content-Type': 'application/x-ndjson; charset=utf-8',
  'Cache-Control': 'no-store, no-transform',
  'X-Accel-Buffering': 'no',
} as const;

export const SOURCE_CHECK_BATCH_SIZE = 4;
export const SOURCE_CHECK_TIMEOUT_MS = 8000;
export const SOURCE_CHECK_MAX_BYTES = 8 * 1024 * 1024;
export const SOURCE_CHECK_HTML_MAX_BYTES = 2 * 1024 * 1024;
export const SOURCE_CHECK_MAX_REDIRECTS = 3;
export const RADAR_CRAWL_MAX_PAGES_PER_HOST = 12;
export const RADAR_CRAWL_MAX_PAGES = 60;
export const RADAR_CRAWL_MAX_SITEMAPS_PER_HOST = 4;
export const RADAR_CRAWL_MAX_SITEMAP_BYTES = 2 * 1024 * 1024;
export const RADAR_CRAWL_MAX_ROBOTS_BYTES = 512 * 1024;
export const RADAR_CRAWL_MAX_DEPTH = 2;
export const RADAR_CRAWL_PATH_TERMS = [
  'program',
  'bantuan',
  'beasiswa',
  'pendaftaran',
  'pengumuman',
  'berita',
  'informasi',
  'layanan',
  'subsidi',
  'pelatihan',
  'penerima',
  'jadwal',
  'syarat',
  'umkm',
  'pendidikan',
  'kesehatan',
  'sosial',
] as const;

export const RADAR_HIDDEN_HTML_TAGS = new Set([
  'script',
  'style',
  'svg',
  'noscript',
  'iframe',
  'nav',
  'aside',
  'form',
]);
export const RADAR_BLOCK_HTML_TAGS = new Set([
  'article',
  'section',
  'div',
  'p',
  'li',
  'h1',
  'h2',
  'h3',
  'h4',
  'h5',
  'h6',
  'tr',
  'br',
]);

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

export const MODEL_COOLDOWN_MS = 60_000;

export const OFFICIAL_SEARCH_URL = 'https://api.tavily.com/search';
export const OFFICIAL_EXTRACT_URL = 'https://api.tavily.com/extract';
export const OFFICIAL_SEARCH_RESULT_LIMIT = 5;
export const OFFICIAL_SNIPPET_LIMIT = 700;
export const OFFICIAL_PAGE_TEXT_LIMIT = 7000;
export const OFFICIAL_WEB_TIMEOUT_MS = 25_000;
