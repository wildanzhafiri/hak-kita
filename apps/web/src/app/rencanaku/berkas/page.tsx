import type { Metadata } from 'next';
import { redirect } from 'next/navigation';

export const metadata: Metadata = { title: 'Rencanaku' };

export default function RencanakuBerkasPage() {
  redirect('/rencanaku');
}
