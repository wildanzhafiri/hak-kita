import type { Program } from '@hakkita/schema';
import { DEFAULT_STEPS } from './constants';
import type { StepProgress } from './types';

export const EMPTY_STEP_PROGRESS: StepProgress = { completed: [], stuck: null };

export function programSteps(program: Program): readonly string[] {
  return program.langkah.length > 0 ? program.langkah : DEFAULT_STEPS;
}

export function parseStepProgress(raw: string | null, stepCount: number): StepProgress {
  if (!raw) return EMPTY_STEP_PROGRESS;
  try {
    const parsed: unknown = JSON.parse(raw);
    if (typeof parsed !== 'object' || parsed === null || Array.isArray(parsed)) {
      return EMPTY_STEP_PROGRESS;
    }
    if (!('completed' in parsed) || !Array.isArray(parsed.completed)) {
      return EMPTY_STEP_PROGRESS;
    }
    const completedEntries: unknown[] = parsed.completed;
    const completed = [
      ...new Set(
        completedEntries.filter(
          (index): index is number =>
            typeof index === 'number' && Number.isInteger(index) && index >= 0 && index < stepCount,
        ),
      ),
    ].sort((a, b) => a - b);
    const stuck =
      'stuck' in parsed &&
      Number.isInteger(parsed.stuck) &&
      typeof parsed.stuck === 'number' &&
      parsed.stuck >= 0 &&
      parsed.stuck < stepCount &&
      !completed.includes(parsed.stuck)
        ? parsed.stuck
        : null;
    return { completed, stuck };
  } catch {
    return EMPTY_STEP_PROGRESS;
  }
}

export function serializeStepProgress(progress: StepProgress): string {
  return JSON.stringify(progress);
}

export function toggleStepCompleted(progress: StepProgress, index: number): StepProgress {
  const completed = progress.completed.includes(index)
    ? progress.completed.filter((value) => value !== index)
    : [...progress.completed, index].sort((a, b) => a - b);
  return { completed, stuck: progress.stuck === index ? null : progress.stuck };
}

export function toggleStepStuck(progress: StepProgress, index: number): StepProgress {
  return {
    completed: progress.completed.filter((value) => value !== index),
    stuck: progress.stuck === index ? null : index,
  };
}
