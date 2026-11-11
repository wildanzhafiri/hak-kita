import type { Metadata } from 'next';
import { redirect } from 'next/navigation';

export const metadata: Metadata = { title: 'Program dan layanan tersimpan di Rencanaku' };

export default function RencanakuTersimpanPage() {
  redirect('/rencanaku');
}
