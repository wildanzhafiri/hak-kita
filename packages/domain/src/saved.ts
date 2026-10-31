export function parseSavedIds(raw: string | null): string[] {
  if (raw === null) return [];
  let value: unknown;
  try {
    value = JSON.parse(raw);
  } catch {
    return [];
  }
  if (!Array.isArray(value)) return [];
  return [...new Set(value.filter((id): id is string => typeof id === 'string'))];
}

export function toggleSavedId(ids: readonly string[], id: string): string[] {
  return ids.includes(id) ? ids.filter((saved) => saved !== id) : [...ids, id];
}

export function serializeSavedIds(ids: readonly string[]): string {
  return JSON.stringify(ids);
}
