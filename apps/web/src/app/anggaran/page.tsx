import type { Metadata } from 'next';
import { ComingSoon } from '@/components/layout/coming-soon';
import { ANGGARAN_CONTENT } from './content';

export const metadata: Metadata = { title: 'Telusuri Anggaran' };

export default function AnggaranPage() {
  return <ComingSoon {...ANGGARAN_CONTENT} />;
}
