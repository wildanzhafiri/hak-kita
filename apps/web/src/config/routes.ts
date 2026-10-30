export const SEARCH_PATH = '/pencarian';

export function searchHref(query: string): string {
  return `${SEARCH_PATH}?q=${encodeURIComponent(query)}`;
}
