import type { UIMessage } from 'ai';

export function getSavedProgramIds(message: UIMessage): string[] {
  return message.parts.flatMap((part) => {
    if (part.type !== 'tool-saveProgramToPlan' || part.state !== 'output-available') return [];
    const output: unknown = part.output;
    if (typeof output !== 'object' || output === null || !('saved' in output) || output.saved !== true) return [];
    if (!('programId' in output) || typeof output.programId !== 'string') return [];
    return [output.programId];
  });
}
