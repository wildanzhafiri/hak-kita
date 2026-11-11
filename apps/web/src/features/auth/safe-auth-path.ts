import { ACCOUNT_ONLY_PATH_PATTERN, DEFAULT_AUTH_REDIRECT, GUEST_FALLBACK_PATH } from './constants';

function isLocalPath(path: string | null | undefined): path is string {
  return Boolean(path) && path!.startsWith('/') && !path!.startsWith('//') && !path!.includes('\\');
}

export function safeAuthPath(path: string | null | undefined): string {
  return isLocalPath(path) ? path : DEFAULT_AUTH_REDIRECT;
}

export function guestDestination(path: string | null | undefined): string {
  if (!isLocalPath(path)) return GUEST_FALLBACK_PATH;
  return ACCOUNT_ONLY_PATH_PATTERN.test(path) ? GUEST_FALLBACK_PATH : path;
}
