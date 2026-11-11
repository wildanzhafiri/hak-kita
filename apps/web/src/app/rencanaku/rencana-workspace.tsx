import { todayWIB } from '@hakkita/domain';
import { RencanaGuestGate } from '@/features/rencana/rencana-guest-gate';
import { RencanaProvider } from '@/features/rencana/rencana-provider';
import { RencanaShell } from '@/features/rencana/rencana-shell';
import { getCurrentUser } from '@/server/current-user';
import { loadPublishedInformation, loadWilayahFile } from '@/server/data';
import type { RencanakuLayoutProps } from './types';

export async function RencanaWorkspace({ children }: RencanakuLayoutProps) {
  if (!(await getCurrentUser())) return <RencanaGuestGate />;

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
