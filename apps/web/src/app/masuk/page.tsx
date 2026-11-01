import type { Metadata } from 'next';
import { ComingSoon } from '@/components/layout/coming-soon';
import { MASUK_CONTENT } from './content';

export const metadata: Metadata = { title: 'Masuk' };

export default function MasukPage() {
  return <ComingSoon {...MASUK_CONTENT} />;
}
