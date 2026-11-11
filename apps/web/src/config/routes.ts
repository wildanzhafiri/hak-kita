export const PROGRAM_CATALOG_PATH = '/kenali-hakmu';
export const SEARCH_PATH = '/pencarian';

export function searchHref(query: string): string {
  const params = new URLSearchParams({ q: query });
  return `${SEARCH_PATH}?${params.toString()}`;
}

export function programCategoryHref(category: string): string {
  const params = new URLSearchParams({ kategori: category });
  return `${PROGRAM_CATALOG_PATH}?${params.toString()}`;
}
