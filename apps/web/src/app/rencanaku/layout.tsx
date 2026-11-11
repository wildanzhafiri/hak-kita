import { Suspense } from 'react';
import { RencanaLoading } from '@/features/rencana/rencana-loading';
import { RencanaWorkspace } from './rencana-workspace';
import type { RencanakuLayoutProps } from './types';

export const dynamic = 'force-dynamic';

export default function RencanakuLayout({ children }: RencanakuLayoutProps) {
  return (
    <Suspense fallback={<RencanaLoading />}>
      <RencanaWorkspace>{children}</RencanaWorkspace>
    </Suspense>
  );
}
