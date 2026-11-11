import type { Program } from '@hakkita/schema';
import { AUDIENCE_DEFAULT, AUDIENCE_RULES } from './constants';

function audienceOf(target: string): string {
  return AUDIENCE_RULES.find((rule) => rule.pattern.test(target))?.label ?? AUDIENCE_DEFAULT;
}

export function audienceGroups(program: Pick<Program, 'untuk'>): string[] {
  return [...new Set(program.untuk.map(audienceOf))];
}
