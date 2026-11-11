import 'server-only';
import type { RadarRunReporter } from './types';

export const ignoreRadarEvent: RadarRunReporter = () => undefined;

const MAX_ERROR_DETAIL_LENGTH = 240;

export function describeRunError(error: unknown): string {
  const name = error instanceof Error ? error.name : 'Error';
  const message = error instanceof Error ? error.message : String(error);
  return `${name}: ${message}`.replace(/\s+/g, ' ').slice(0, MAX_ERROR_DETAIL_LENGTH);
}

export function readSourceHost(sourceUrl: string): string {
  try {
    return new URL(sourceUrl).hostname;
  } catch {
    return sourceUrl;
  }
}
