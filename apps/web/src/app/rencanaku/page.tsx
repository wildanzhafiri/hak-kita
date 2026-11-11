import type { Metadata } from 'next';
import { RencanaSaved } from '@/features/rencana/rencana-saved';

export const metadata: Metadata = { title: 'Rencanaku' };

export default function RencanakuPage() {
  const isEmailAvailable = Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
    process.env.SUPABASE_SERVICE_ROLE_KEY &&
    process.env.RESEND_API_KEY &&
    process.env.EMAIL_FROM &&
    process.env.CRON_SECRET &&
    process.env.HAKKITA_SITE_URL,
  );
  return <RencanaSaved isEmailAvailable={isEmailAvailable} />;
}
