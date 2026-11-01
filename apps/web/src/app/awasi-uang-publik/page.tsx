import type { Metadata } from 'next';
import { redirect } from 'next/navigation';

export const metadata: Metadata = { title: 'Telusuri Anggaran' };

export default function AwasiUangPublikPage() {
  redirect('/anggaran');
}
