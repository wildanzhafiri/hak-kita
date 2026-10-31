import type { Metadata } from 'next';
import { RencanaSummary } from '@/features/rencana/rencana-summary';

export const metadata: Metadata = { title: 'Rencanaku' };

export default function RencanakuPage() {
  return <RencanaSummary />;
}
