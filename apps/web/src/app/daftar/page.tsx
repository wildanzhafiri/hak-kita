import type { Metadata } from 'next';
import { ComingSoon } from '@/components/layout/coming-soon';
import { DAFTAR_CONTENT } from './content';

export const metadata: Metadata = { title: 'Daftar' };

export default function DaftarPage() {
  return <ComingSoon {...DAFTAR_CONTENT} />;
}
