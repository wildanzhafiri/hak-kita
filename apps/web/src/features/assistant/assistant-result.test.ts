import { describe, expect, it } from 'vitest';
import type { UIMessage } from 'ai';
import { getSavedProgramIds } from './assistant-result';

describe('getSavedProgramIds', () => {
  it('updates local saved state only after the server confirms a save', () => {
    const pending: UIMessage = {
      id: 'pending', role: 'assistant',
      parts: [{ type: 'tool-saveProgramToPlan', toolCallId: 'save-1', state: 'approval-requested', input: { programId: 'kip-kuliah' }, approval: { id: 'approval-1' } }],
    };
    const completed: UIMessage = {
      id: 'completed', role: 'assistant',
      parts: [
        { type: 'tool-saveProgramToPlan', toolCallId: 'save-1', state: 'output-available', input: { programId: 'kip-kuliah' }, output: { saved: true, programId: 'kip-kuliah' } },
        { type: 'tool-saveProgramToPlan', toolCallId: 'save-2', state: 'output-available', input: { programId: 'pkh' }, output: { saved: false, programId: 'pkh' } },
      ],
    };

    expect(getSavedProgramIds(pending)).toEqual([]);
    expect(getSavedProgramIds(completed)).toEqual(['kip-kuliah']);
  });
});
