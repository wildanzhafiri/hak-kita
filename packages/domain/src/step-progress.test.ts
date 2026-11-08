import { describe, expect, it } from 'vitest';
import { makeProgram } from './test-helpers';
import { DEFAULT_STEPS } from './constants';
import {
  EMPTY_STEP_PROGRESS,
  parseStepProgress,
  programSteps,
  serializeStepProgress,
  toggleStepCompleted,
  toggleStepStuck,
} from './step-progress';

describe('step progress', () => {
  it('uses the program steps and falls back when none are provided', () => {
    expect(programSteps(makeProgram({ langkah: ['Periksa kanal resmi'] }))).toEqual([
      'Periksa kanal resmi',
    ]);
    expect(programSteps(makeProgram({ langkah: [] }))).toEqual(DEFAULT_STEPS);
  });

  it('keeps completed steps and a single stuck step through storage', () => {
    const withCompleted = toggleStepCompleted(EMPTY_STEP_PROGRESS, 0);
    const withStuck = toggleStepStuck(withCompleted, 1);
    expect(parseStepProgress(serializeStepProgress(withStuck), 3)).toEqual({
      completed: [0],
      stuck: 1,
    });
    expect(toggleStepCompleted(withStuck, 1)).toEqual({ completed: [0, 1], stuck: null });
    expect(toggleStepCompleted(withCompleted, 0)).toEqual(EMPTY_STEP_PROGRESS);
  });

  it('drops invalid and out-of-range stored step indices', () => {
    expect(parseStepProgress('{"completed":[0,0,4,"1",-1],"stuck":4}', 2)).toEqual({
      completed: [0],
      stuck: null,
    });
    expect(parseStepProgress('{"completed":[1],"stuck":1}', 2)).toEqual({
      completed: [1],
      stuck: null,
    });
    expect(parseStepProgress('{broken', 2)).toEqual(EMPTY_STEP_PROGRESS);
  });
});
