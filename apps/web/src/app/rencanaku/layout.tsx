import { todayWIB } from '@hakkita/domain';
import { RencanaProvider } from '@/features/rencana/rencana-provider';
import { RencanaShell } from '@/features/rencana/rencana-shell';
import { loadPrograms, loadWilayahFile } from '@/server/data';
import type { RencanakuLayoutProps } from './types';

export default async function RencanakuLayout({ children }: RencanakuLayoutProps) {
  const [programs, wilayahFile] = await Promise.all([loadPrograms(), loadWilayahFile()]);

  return (
    <div className="rencana-app">
      <RencanaProvider programs={programs} wilayah={wilayahFile.wilayah} builtOn={todayWIB()}>
        <RencanaShell>{children}</RencanaShell>
      </RencanaProvider>
    </div>
  );
}
