import type { Metadata } from 'next';
import { RencanaSaved } from '@/features/rencana/rencana-saved';

export const metadata: Metadata = { title: 'Program tersimpan di Rencanaku' };

export default function RencanakuTersimpanPage() {
  return <RencanaSaved />;
}
