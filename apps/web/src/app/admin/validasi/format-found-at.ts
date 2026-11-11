import { VALIDATION_COPY } from './content';

export function formatFoundAt(value: string): string {
  const date = new Date(value);
  if (!Number.isFinite(date.getTime())) return VALIDATION_COPY.noTime;
  return `${new Intl.DateTimeFormat('id-ID', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    timeZone: 'Asia/Jakarta',
  }).format(date)} WIB`;
}
