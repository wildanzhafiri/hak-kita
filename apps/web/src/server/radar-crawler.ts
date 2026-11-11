import 'server-only';
import { isOfficialDomain } from '@hakkita/domain';
import {
  RADAR_CRAWL_MAX_DEPTH,
  RADAR_CRAWL_MAX_PAGES,
  RADAR_CRAWL_MAX_PAGES_PER_HOST,
  RADAR_CRAWL_MAX_ROBOTS_BYTES,
  RADAR_CRAWL_MAX_SITEMAPS_PER_HOST,
  RADAR_CRAWL_MAX_SITEMAP_BYTES,
  RADAR_CRAWL_PATH_TERMS,
  SOURCE_CHECK_MAX_REDIRECTS,
  SOURCE_CHECK_TIMEOUT_MS,
} from './constants';
import {
  extractRadarFeedUrls,
  extractRadarFeedEntryUrls,
  extractRadarLinks,
  extractRadarRobotsPolicy,
  extractRadarSitemapUrls,
} from './radar-source-text';
import { readProgramSourceFingerprint } from './program-source-fingerprint';
import type { RadarCrawlPage, RadarTextResponse } from './types';

const RADAR_USER_AGENT = 'HAKKITA-Radar';
const RADAR_CRAWL_HEADERS = {
  'User-Agent': `${RADAR_USER_AGENT} (+https://hakkita.id)`,
  Accept:
    'text/html,application/xhtml+xml,application/xml,text/xml,application/rss+xml,application/atom+xml,text/plain;q=0.8',
};

async function readOfficialTextResource(
  resourceUrl: string,
  maxBytes: number,
): Promise<RadarTextResponse | null> {
  let currentUrl = resourceUrl;
  const sourceHostname = new URL(resourceUrl).hostname;
  for (let redirectCount = 0; redirectCount <= SOURCE_CHECK_MAX_REDIRECTS; redirectCount++) {
    const parsedUrl = new URL(currentUrl);
    if (
      parsedUrl.protocol !== 'https:' ||
      !isOfficialDomain(currentUrl) ||
      parsedUrl.hostname !== sourceHostname ||
      parsedUrl.username ||
      parsedUrl.password ||
      (parsedUrl.port !== '' && parsedUrl.port !== '443')
    )
      return null;
    const response = await fetch(currentUrl, {
      headers: RADAR_CRAWL_HEADERS,
      redirect: 'manual',
      signal: AbortSignal.timeout(SOURCE_CHECK_TIMEOUT_MS),
    });
    if (response.status >= 300 && response.status < 400) {
      const location = response.headers.get('location');
      if (!location) return null;
      currentUrl = new URL(location, currentUrl).toString();
      continue;
    }
    if (response.status >= 400 && response.status < 500)
      return { body: '', url: currentUrl, status: response.status };
    if (!response.ok || !response.body) return null;
    const contentType = response.headers.get('content-type')?.toLowerCase() ?? '';
    if (
      !contentType.includes('text/plain') &&
      !contentType.includes('xml') &&
      !contentType.includes('html')
    ) {
      return null;
    }
    const contentLength = Number(response.headers.get('content-length'));
    if (contentLength > maxBytes) return null;
    const reader = response.body.getReader();
    const chunks: Uint8Array[] = [];
    let size = 0;
    try {
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        size += value.byteLength;
        if (size > maxBytes) return null;
        chunks.push(value);
      }
    } finally {
      reader.releaseLock();
      await response.body.cancel().catch(() => undefined);
    }
    return { body: new TextDecoder().decode(Buffer.concat(chunks)), url: currentUrl, status: 200 };
  }
  return null;
}

function normalizeCrawlUrl(value: string, baseUrl: string, hostname: string): string | null {
  try {
    const url = new URL(value, baseUrl);
    url.hash = '';
    if (
      url.protocol !== 'https:' ||
      url.hostname !== hostname ||
      url.username ||
      url.password ||
      !isOfficialDomain(url.toString())
    ) {
      return null;
    }
    return url.toString();
  } catch {
    return null;
  }
}

function scoreCrawlUrl(url: string): number {
  const normalized = url.toLowerCase();
  return RADAR_CRAWL_PATH_TERMS.reduce(
    (score, term) => score + (normalized.includes(term) ? 1 : 0),
    0,
  );
}

function orderCrawlUrls(urls: string[]): string[] {
  return [...new Set(urls)].sort((left, right) => scoreCrawlUrl(right) - scoreCrawlUrl(left));
}

async function readRobotsPolicy(origin: string, hostname: string) {
  try {
    const robots = await readOfficialTextResource(
      new URL('/robots.txt', origin).toString(),
      RADAR_CRAWL_MAX_ROBOTS_BYTES,
    );
    if (!robots) return { allowed: () => false, sitemapUrls: [] as string[] };
    if (robots.status >= 400 && robots.status < 500)
      return { allowed: () => true, sitemapUrls: [] as string[] };
    if (robots.status !== 200) return { allowed: () => false, sitemapUrls: [] as string[] };
    const policy = extractRadarRobotsPolicy(robots.body, RADAR_USER_AGENT);
    const sitemapUrls = policy.sitemapUrls
      .map((url) => normalizeCrawlUrl(url, origin, hostname))
      .filter((url): url is string => url !== null);
    return { allowed: policy.allowed, sitemapUrls };
  } catch {
    return { allowed: () => false, sitemapUrls: [] as string[] };
  }
}

export async function filterOfficialUrlsByRobots(urls: string[]): Promise<string[]> {
  const policyCache = new Map<string, Promise<Awaited<ReturnType<typeof readRobotsPolicy>>>>();
  const allowed = await Promise.all(
    urls.map(async (url) => {
      try {
        const parsed = new URL(url);
        if (
          parsed.protocol !== 'https:' ||
          !isOfficialDomain(url) ||
          parsed.username ||
          parsed.password ||
          (parsed.port !== '' && parsed.port !== '443')
        )
          return null;
        const origin = parsed.origin;
        let policy = policyCache.get(origin);
        if (!policy) {
          policy = readRobotsPolicy(origin, parsed.hostname);
          policyCache.set(origin, policy);
        }
        return (await policy).allowed(parsed.pathname) ? url : null;
      } catch {
        return null;
      }
    }),
  );
  return allowed.filter((url): url is string => url !== null);
}

async function readSitemapUrls(sitemapUrl: string, hostname: string, depth = 0): Promise<string[]> {
  if (depth > 1) return [];
  try {
    const sitemap = await readOfficialTextResource(sitemapUrl, RADAR_CRAWL_MAX_SITEMAP_BYTES);
    if (!sitemap || sitemap.status !== 200) return [];
    const locations = extractRadarSitemapUrls(sitemap.body, sitemap.url)
      .map((url) => normalizeCrawlUrl(url, sitemap.url, hostname))
      .filter((url): url is string => url !== null);
    if (/<sitemapindex(?:\s|>)/i.test(sitemap.body)) {
      const nested = locations.slice(0, RADAR_CRAWL_MAX_SITEMAPS_PER_HOST);
      return (
        await Promise.all(nested.map((url) => readSitemapUrls(url, hostname, depth + 1)))
      ).flat();
    }
    return locations;
  } catch {
    return [];
  }
}

async function crawlOfficialHost(hostname: string, sourceUrls: string[]): Promise<string[]> {
  const origin = `https://${hostname}`;
  const policy = await readRobotsPolicy(origin, hostname);
  const sitemapUrls = policy.sitemapUrls.length
    ? policy.sitemapUrls
    : [new URL('/sitemap.xml', origin).toString()];
  const sitemapPages = (
    await Promise.all(
      sitemapUrls
        .slice(0, RADAR_CRAWL_MAX_SITEMAPS_PER_HOST)
        .map((url) => readSitemapUrls(url, hostname)),
    )
  ).flat();
  const queue: RadarCrawlPage[] = orderCrawlUrls([...sourceUrls, ...sitemapPages])
    .filter((url) => {
      const pathname = new URL(url).pathname;
      return policy.allowed(pathname);
    })
    .map((url) => ({ url, depth: 0 }));
  const visited = new Set<string>();
  const discovered: string[] = [...sourceUrls];
  let crawled = 0;

  while (queue.length > 0 && crawled < RADAR_CRAWL_MAX_PAGES_PER_HOST) {
    const page = queue.shift();
    if (!page || visited.has(page.url)) continue;
    visited.add(page.url);
    const pathname = new URL(page.url).pathname;
    if (!policy.allowed(pathname)) continue;
    let html: string | null = null;
    try {
      const source = await readProgramSourceFingerprint(page.url, null, null, true);
      html = source?.html ?? null;
    } catch {
      continue;
    }
    crawled += 1;
    discovered.push(page.url);
    if (!html || page.depth >= RADAR_CRAWL_MAX_DEPTH) continue;
    const feeds = extractRadarFeedUrls(html, page.url);
    for (const feedUrl of feeds.slice(0, 2)) {
      try {
        const feed = await readOfficialTextResource(feedUrl, RADAR_CRAWL_MAX_SITEMAP_BYTES);
        if (!feed || feed.status !== 200) continue;
        const feedLinks = extractRadarSitemapUrls(feed.body, feed.url)
          .concat(extractRadarFeedEntryUrls(feed.body, feed.url))
          .concat(extractRadarLinks(feed.body, feed.url))
          .map((url) => normalizeCrawlUrl(url, feed.url, hostname))
          .filter((url): url is string => url !== null);
        for (const url of orderCrawlUrls(feedLinks)) {
          if (!visited.has(url) && policy.allowed(new URL(url).pathname)) {
            queue.push({ url, depth: page.depth + 1 });
          }
        }
      } catch {
        continue;
      }
    }
    const linkedPages = extractRadarLinks(html, page.url)
      .map((url) => normalizeCrawlUrl(url, page.url, hostname))
      .filter((url): url is string => url !== null)
      .filter((url) => policy.allowed(new URL(url).pathname));
    for (const url of orderCrawlUrls(linkedPages)) {
      if (!visited.has(url)) queue.push({ url, depth: page.depth + 1 });
    }
  }
  return discovered;
}

export async function discoverOfficialPages(sourceUrls: string[]): Promise<string[]> {
  const urlsByHost = new Map<string, string[]>();
  for (const sourceUrl of sourceUrls) {
    const normalized = normalizeCrawlUrl(sourceUrl, sourceUrl, new URL(sourceUrl).hostname);
    if (!normalized) continue;
    const hostname = new URL(normalized).hostname;
    const urls = urlsByHost.get(hostname) ?? [];
    urls.push(normalized);
    urlsByHost.set(hostname, urls);
  }
  const hostResults = await Promise.all(
    [...urlsByHost.entries()].map(([hostname, urls]) => crawlOfficialHost(hostname, urls)),
  );
  return orderCrawlUrls(hostResults.flat()).slice(0, RADAR_CRAWL_MAX_PAGES);
}
