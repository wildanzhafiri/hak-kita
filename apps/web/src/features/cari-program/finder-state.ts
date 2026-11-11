import { EMPTY_PREFERENCES, hasPreferences } from '@hakkita/domain';
import { PreferensiProfilSchema } from '@hakkita/schema';
import type { PreferensiProfil } from '@hakkita/schema';
import { ACTIVITY_LABELS, EDUCATION_LABELS } from '@/features/profil/constants';
import { describeRegion } from '@/features/profil/profile-regions';
import type { ProfileRegions } from '@/features/profil/types';
import {
  FINDER_GUEST_STORAGE_ID,
  FINDER_STEP_IDS,
  FINDER_STORAGE_PREFIX,
  FINDER_SUMMARY_LIMIT,
} from './constants';
import type { FinderState } from './types';

const LAST_STEP = FINDER_STEP_IDS.length - 1;

function parseStoredState(value: unknown): FinderState | null {
  if (!value || typeof value !== 'object') return null;
  const { answers, step, showResults, showProfileChoice } = value as Record<string, unknown>;
  const parsedAnswers = PreferensiProfilSchema.safeParse(answers);
  if (
    !parsedAnswers.success ||
    typeof step !== 'number' ||
    !Number.isInteger(step) ||
    step < 0 ||
    step > LAST_STEP ||
    typeof showResults !== 'boolean' ||
    typeof showProfileChoice !== 'boolean'
  ) {
    return null;
  }
  return { answers: parsedAnswers.data, step, showResults, showProfileChoice };
}

export function finderStorageKey(userId: string | null): string {
  return `${FINDER_STORAGE_PREFIX}${userId ?? FINDER_GUEST_STORAGE_ID}`;
}

export function freshFinderState(showProfileChoice: boolean): FinderState {
  return { answers: EMPTY_PREFERENCES, step: 0, showResults: false, showProfileChoice };
}

export function loadFinderState(key: string, savedPreferences: PreferensiProfil): FinderState {
  try {
    const raw = window.sessionStorage.getItem(key);
    const stored = raw ? parseStoredState(JSON.parse(raw)) : null;
    if (stored) return stored;
  } catch {
    return freshFinderState(hasPreferences(savedPreferences));
  }
  return freshFinderState(hasPreferences(savedPreferences));
}

export function saveFinderState(key: string, state: FinderState): void {
  try {
    window.sessionStorage.setItem(key, JSON.stringify(state));
  } catch {
    return;
  }
}

export function canAdvance(step: number, answers: PreferensiProfil): boolean {
  return step !== 0 || answers.minat.length > 0;
}

export function toggleItem<T extends string>(items: readonly T[], value: T): T[] {
  return items.includes(value) ? items.filter((item) => item !== value) : [...items, value];
}

export function summarizeAnswers(
  answers: PreferensiProfil,
  regions: ProfileRegions | null,
): { shown: string[]; hidden: number } {
  const region = regions ? describeRegion(regions, answers.provinsi, answers.kota) : '';
  const all = [
    ...answers.minat,
    ...answers.kegiatan.map((activity) => ACTIVITY_LABELS[activity]),
    region,
    answers.pendidikan ? EDUCATION_LABELS[answers.pendidikan] : '',
  ].filter(Boolean);
  return {
    shown: all.slice(0, FINDER_SUMMARY_LIMIT),
    hidden: Math.max(0, all.length - FINDER_SUMMARY_LIMIT),
  };
}
