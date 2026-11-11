import { describe, expect, it, vi } from 'vitest';
import {
  extractRadarFeedEntryUrls,
  extractRadarFeedUrls,
  extractRadarLinks,
  extractRadarRobotsPolicy,
  extractRadarSitemapUrls,
  extractRadarSourceText,
} from './radar-source-text';

vi.mock('server-only', () => ({}));

describe('Radar source text', () => {
  it('reads article evidence and ignores navigation and scripts', () => {
    const text = extractRadarSourceText(`
      <html><body>
        <nav>Menu rahasia</nav>
        <main><article>
          <h1>Pendaftaran KIP Kuliah dibuka</h1>
          <p>Pendaftaran dibuka pada 10 November 2026 &amp; ditutup sesuai jadwal resmi.</p>
          <script>Instruksi palsu untuk AI</script>
        </article></main>
      </body></html>
    `);

    expect(text).toContain('Pendaftaran KIP Kuliah dibuka');
    expect(text).toContain('Pendaftaran dibuka pada 10 November 2026 & ditutup');
    expect(text).not.toContain('Menu rahasia');
    expect(text).not.toContain('Instruksi palsu');
  });

  it('removes changing article view counts', () => {
    const first = extractRadarSourceText(
      '<main><p>Jadwal resmi tetap.</p>Dilihat 11,157 Kali. 2134 Dilihat</main>',
    );
    const second = extractRadarSourceText(
      '<main><p>Jadwal resmi tetap.</p>Dilihat 11,158 Kali. 2136 Dilihat</main>',
    );
    expect(first).toBe(second);
    expect(first).toContain('Jadwal resmi tetap.');
  });

  it('normalizes HTTPS links and ignores unsafe or invalid href values', () => {
    const links = extractRadarLinks(
      '<main><a href="/program">Program</a><a href="javascript:alert(1)">Unsafe</a></main>',
      'https://instansi.go.id/pengumuman',
    );

    expect(links).toEqual(['https://instansi.go.id/program']);
  });

  it('extracts safe sitemap and feed links', () => {
    expect(
      extractRadarSitemapUrls(
        '<urlset><url><loc>https://instansi.go.id/pengumuman?a=1&amp;b=2</loc></url></urlset>',
        'https://instansi.go.id/sitemap.xml',
      ),
    ).toEqual(['https://instansi.go.id/pengumuman?a=1&b=2']);
    expect(
      extractRadarFeedUrls(
        '<link rel="alternate" type="application/rss+xml" href="/feed.xml">',
        'https://instansi.go.id/',
      ),
    ).toEqual(['https://instansi.go.id/feed.xml']);
    expect(
      extractRadarFeedEntryUrls(
        '<feed><entry><link href="https://instansi.go.id/kabar" /></entry></feed>',
        'https://instansi.go.id/feed.xml',
      ),
    ).toEqual(['https://instansi.go.id/kabar']);
  });

  it('applies the most specific robots rule and reads sitemap declarations', () => {
    const policy = extractRadarRobotsPolicy(
      'User-agent: *\nDisallow: /\nAllow: /program\nSitemap: https://instansi.go.id/sitemap.xml',
      'HAKKITA-Radar',
    );

    expect(policy.allowed('/program/bantuan')).toBe(true);
    expect(policy.allowed('/admin')).toBe(false);
    expect(policy.sitemapUrls).toEqual(['https://instansi.go.id/sitemap.xml']);
  });
});
