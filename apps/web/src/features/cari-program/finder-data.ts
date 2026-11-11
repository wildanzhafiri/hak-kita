import type { Recommendation } from '@hakkita/domain';
import { ProgramSchema } from '@hakkita/schema';
import type { PreferensiProfil } from '@hakkita/schema';
import type { ProfileRegions, RegionOption } from '@/features/profil/types';

function isRegionOption(value: unknown): value is RegionOption {
  if (!value || typeof value !== 'object') return false;
  const { kode, nama } = value as Record<string, unknown>;
  return typeof kode === 'string' && typeof nama === 'string';
}

function isProfileRegions(value: unknown): value is ProfileRegions {
  if (!value || typeof value !== 'object') return false;
  const { provinces, citiesByProvince } = value as Record<string, unknown>;
  return (
    Array.isArray(provinces) &&
    provinces.every(isRegionOption) &&
    typeof citiesByProvince === 'object' &&
    citiesByProvince !== null
  );
}

function isStringList(value: unknown): value is string[] {
  return Array.isArray(value) && value.every((item) => typeof item === 'string');
}

function toRecommendation(value: unknown): Recommendation | null {
  if (!value || typeof value !== 'object') return null;
  const { program, score, reasons, checks, periodStatus } = value as Record<string, unknown>;
  const parsedProgram = ProgramSchema.safeParse(program);
  if (
    !parsedProgram.success ||
    typeof score !== 'number' ||
    !isStringList(reasons) ||
    !isStringList(checks) ||
    typeof periodStatus !== 'string'
  ) {
    return null;
  }
  return {
    program: parsedProgram.data,
    score,
    reasons,
    checks,
    periodStatus: periodStatus as Recommendation['periodStatus'],
  };
}

export async function fetchRegions(): Promise<ProfileRegions> {
  const response = await fetch('/api/wilayah');
  if (!response.ok) throw new Error('regions-unavailable');
  const body: unknown = await response.json();
  if (!isProfileRegions(body)) throw new Error('regions-invalid');
  return body;
}

export async function fetchRecommendations(
  preferences: PreferensiProfil,
): Promise<Recommendation[]> {
  const response = await fetch('/api/rekomendasi', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(preferences),
  });
  if (!response.ok) throw new Error('recommendations-unavailable');
  const body: unknown = await response.json();
  const items =
    body && typeof body === 'object' && 'recommendations' in body ? body.recommendations : null;
  if (!Array.isArray(items)) throw new Error('recommendations-invalid');
  return items.flatMap((item) => {
    const recommendation = toRecommendation(item);
    return recommendation ? [recommendation] : [];
  });
}
