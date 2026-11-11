import { todayWIB } from '@hakkita/domain';
import { RencanaProvider } from '@/features/rencana/rencana-provider';
import { RencanaShell } from '@/features/rencana/rencana-shell';
import { loadPublishedInformation, loadWilayahFile } from '@/server/data';
import type { RencanakuLayoutProps } from './types';

export default async function RencanakuLayout({ children }: RencanakuLayoutProps) {
  const [programs, wilayahFile] = await Promise.all([
    loadPublishedInformation(),
    loadWilayahFile(),
  ]);

  return (
    <div className="rencana-app">
      <RencanaProvider programs={programs} wilayah={wilayahFile.wilayah} builtOn={todayWIB()}>
        <RencanaShell>{children}</RencanaShell>
      </RencanaProvider>
    </div>
  );
}
