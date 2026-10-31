import type { Metadata } from 'next';
import { RencanaDeadlines } from '@/features/rencana/rencana-deadlines';

export const metadata: Metadata = { title: 'Tenggat di Rencanaku' };

export default function RencanakuTenggatPage() {
  return <RencanaDeadlines />;
}
