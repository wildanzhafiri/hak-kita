const MAX_INITIALS = 2;

export function profileInitials(nama: string, email: string): string {
  const source = nama.trim() || email.split('@')[0] || '?';
  const initials = source
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, MAX_INITIALS)
    .map((word) => Array.from(word)[0] ?? '')
    .join('')
    .toUpperCase();
  return initials || '?';
}

export function profileDisplayName(nama: string, email: string): string {
  return nama.trim() || email;
}
