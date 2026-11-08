import { DEFAULT_AUTH_REDIRECT } from './constants';

export function safeAuthPath(path: string | null | undefined): string {
  if (!path || !path.startsWith('/') || path.startsWith('//') || path.includes('\\')) {
    return DEFAULT_AUTH_REDIRECT;
  }
  return path;
}
