import type { SumberUtama } from '@hakkita/schema';
import { OFFICIAL_DOMAIN, STALE_AFTER_DAYS } from './constants';
import { daysSince } from './date';

export function hostnameOf(url: string): string | null {
  try {
    return new URL(url).hostname.toLowerCase();
  } catch {
    return null;
  }
}

export function isOfficialDomain(url: string): boolean {
  const host = hostnameOf(url);
  return host !== null && (host === OFFICIAL_DOMAIN || host.endsWith(`.${OFFICIAL_DOMAIN}`));
}

export function checkSumberUtama(sumber: SumberUtama): string | null {
  if (!sumber.url.startsWith('https://')) return 'Sumber utama harus memakai https';
  if (sumber.jenis === 'bank-penyalur') return null;
  if (!isOfficialDomain(sumber.url)) {
    const host = hostnameOf(sumber.url) ?? sumber.url;
    return `Sumber jenis "${sumber.jenis}" harus berdomain .go.id (ditemukan: ${host})`;
  }
  return null;
}

export function isStale(
  checkedOn: string,
  today: string,
  limit: number = STALE_AFTER_DAYS,
): boolean {
  return daysSince(checkedOn, today) > limit;
}
