import type { Metadata } from 'next';
import { RencanaBerkas } from '@/features/rencana/rencana-berkas';

export const metadata: Metadata = { title: 'Berkas di Rencanaku' };

export default function RencanakuBerkasPage() {
  return <RencanaBerkas />;
}
