import 'server-only';
import { defaultTreeAdapter, parse, type DefaultTreeAdapterTypes } from 'parse5';
import { RADAR_BLOCK_HTML_TAGS, RADAR_HIDDEN_HTML_TAGS } from './constants';

function findElement(
  node: DefaultTreeAdapterTypes.Node,
  tagName: string,
): DefaultTreeAdapterTypes.Element | null {
  if (defaultTreeAdapter.isElementNode(node) && node.tagName === tagName) return node;
  if (!('childNodes' in node)) return null;
  for (const child of node.childNodes) {
    const match = findElement(child, tagName);
    if (match) return match;
  }
  return null;
}

function collectText(node: DefaultTreeAdapterTypes.Node, parts: string[]): void {
  if (defaultTreeAdapter.isTextNode(node)) {
    parts.push(node.value);
    return;
  }
  if (defaultTreeAdapter.isElementNode(node)) {
    if (RADAR_HIDDEN_HTML_TAGS.has(node.tagName)) return;
    if (
      node.attrs.some((attribute) => attribute.name === 'aria-hidden' && attribute.value === 'true')
    ) {
      return;
    }
    if (RADAR_BLOCK_HTML_TAGS.has(node.tagName)) parts.push('\n');
  }
  if ('childNodes' in node) {
    for (const child of node.childNodes) collectText(child, parts);
  }
  if (defaultTreeAdapter.isElementNode(node) && RADAR_BLOCK_HTML_TAGS.has(node.tagName))
    parts.push('\n');
}

export function extractRadarSourceText(html: string): string {
  const document = parse(html);
  const main = findElement(document, 'main');
  const content =
    (main && findElement(main, 'article')) ??
    main ??
    findElement(document, 'article') ??
    findElement(document, 'body') ??
    document;
  const parts: string[] = [];
  collectText(content, parts);
  return parts
    .join(' ')
    .replace(/[\t ]+/g, ' ')
    .replace(/\n\s*\n+/g, '\n')
    .replace(/\bDilihat\s+[\d.,]+\s+Kali\b/gi, '')
    .replace(/\b[\d.,]+\s+Dilihat\b/gi, '')
    .trim();
}

export function extractRadarLinks(html: string, baseUrl: string): string[] {
  const document = parse(html);
  const links: string[] = [];
  const visit = (node: DefaultTreeAdapterTypes.Node) => {
    if (defaultTreeAdapter.isElementNode(node) && node.tagName === 'a') {
      const href = node.attrs.find((attribute) => attribute.name === 'href')?.value;
      if (href) {
        try {
          const url = new URL(href, baseUrl);
          if (url.protocol === 'https:') links.push(url.toString());
        } catch {
          return;
        }
      }
    }
    if ('childNodes' in node) node.childNodes.forEach(visit);
  };
  visit(document);
  return [...new Set(links)];
}

export function extractRadarSitemapUrls(text: string, baseUrl: string): string[] {
  const urls: string[] = [];
  const matches = text.matchAll(/<loc(?:\s[^>]*)?>([\s\S]*?)<\/loc\s*>/gi);
  for (const match of matches) {
    const value = match[1]?.trim().replace(/&amp;/g, '&');
    if (!value) continue;
    try {
      const url = new URL(value, baseUrl);
      if (url.protocol === 'https:') urls.push(url.toString());
    } catch {
      continue;
    }
  }
  return [...new Set(urls)];
}

export function extractRadarFeedUrls(html: string, baseUrl: string): string[] {
  const document = parse(html);
  const feeds: string[] = [];
  const visit = (node: DefaultTreeAdapterTypes.Node) => {
    if (defaultTreeAdapter.isElementNode(node) && node.tagName === 'link') {
      const rel = node.attrs.find((attribute) => attribute.name === 'rel')?.value.toLowerCase();
      const type = node.attrs.find((attribute) => attribute.name === 'type')?.value.toLowerCase();
      const href = node.attrs.find((attribute) => attribute.name === 'href')?.value;
      if (
        rel?.split(/\s+/).includes('alternate') &&
        (type?.includes('rss') || type?.includes('atom')) &&
        href
      ) {
        try {
          const url = new URL(href, baseUrl);
          if (url.protocol === 'https:') feeds.push(url.toString());
        } catch {
          return;
        }
      }
    }
    if ('childNodes' in node) node.childNodes.forEach(visit);
  };
  visit(document);
  return [...new Set(feeds)];
}

export function extractRadarFeedEntryUrls(text: string, baseUrl: string): string[] {
  const document = parse(text);
  const urls: string[] = [];
  const visit = (node: DefaultTreeAdapterTypes.Node) => {
    if (defaultTreeAdapter.isElementNode(node) && node.tagName === 'link') {
      const href = node.attrs.find((attribute) => attribute.name === 'href')?.value;
      if (href) {
        try {
          const url = new URL(href, baseUrl);
          if (url.protocol === 'https:') urls.push(url.toString());
        } catch {
          return;
        }
      }
    }
    if ('childNodes' in node) node.childNodes.forEach(visit);
  };
  visit(document);
  const matches = text.matchAll(/<link(?:\s[^>]*)?>([^<]+)<\/link\s*>/gi);
  for (const match of matches) {
    const value = match[1]?.trim().replace(/&amp;/g, '&');
    if (!value) continue;
    try {
      const url = new URL(value, baseUrl);
      if (url.protocol === 'https:') urls.push(url.toString());
    } catch {
      continue;
    }
  }
  return [...new Set(urls)];
}

export function extractRadarRobotsPolicy(text: string, userAgent: string) {
  const groups: { agents: string[]; rules: { allow: boolean; path: string }[] }[] = [];
  let current: { agents: string[]; rules: { allow: boolean; path: string }[] } | null = null;
  let hasRules = false;
  const sitemapUrls: string[] = [];
  for (const rawLine of text.split(/\r?\n/)) {
    const line = rawLine.split('#', 1)[0]?.trim();
    if (!line) continue;
    const separator = line.indexOf(':');
    if (separator < 0) continue;
    const name = line.slice(0, separator).trim().toLowerCase();
    const value = line.slice(separator + 1).trim();
    if (name === 'sitemap') {
      sitemapUrls.push(value);
      continue;
    }
    if (name === 'user-agent') {
      if (!current || hasRules) {
        current = { agents: [], rules: [] };
        groups.push(current);
        hasRules = false;
      }
      current.agents.push(value.toLowerCase());
      continue;
    }
    if ((name === 'allow' || name === 'disallow') && current && value) {
      current.rules.push({ allow: name === 'allow', path: value });
      hasRules = true;
    }
  }
  const agent = userAgent.toLowerCase();
  const matchingGroups = groups.filter((group) => group.agents.some((entry) => entry === agent));
  const selectedGroups =
    matchingGroups.length > 0
      ? matchingGroups
      : groups.filter((group) => group.agents.includes('*'));
  const rules = selectedGroups.flatMap((group) => group.rules);
  const allowed = (pathname: string) => {
    const matchingRules = rules
      .map((rule) => ({ ...rule, length: rule.path.replace(/[\*$]/g, '').length }))
      .filter((rule) => {
        const escaped = rule.path
          .replace(/[.+?^${}()|[\]\\]/g, '\\$&')
          .replace(/\*/g, '.*')
          .replace(/\$$/, '$');
        return new RegExp(`^${escaped}`).test(pathname);
      })
      .sort((left, right) => right.length - left.length);
    return matchingRules[0]?.allow ?? true;
  };
  return { allowed, sitemapUrls };
}
