import { Turnstile } from '@/components/ui/turnstile';
import type { RencanaTurnstileProps } from './types';

export function RencanaTurnstile({ siteKey, resetKey, onToken }: RencanaTurnstileProps) {
  return (
    <Turnstile
      label="Verifikasi keamanan laporan"
      onToken={onToken}
      resetKey={resetKey}
      siteKey={siteKey}
      action="obstacle_report"
    />
  );
}
