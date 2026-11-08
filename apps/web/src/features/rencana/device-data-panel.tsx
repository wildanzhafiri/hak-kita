'use client';

import { ClearAllButton } from './clear-all-button';
import { useRencanaState } from './rencana-context';

export function DeviceDataPanel() {
  const { entries, saved, guided, clearAll } = useRencanaState();
  if (entries.length + saved.length + guided.length === 0) return null;

  return (
    <aside className="device-data">
      <p>
        Program tersimpan dan progres berkas terhubung ke akun saat kamu masuk. Progres langkah
        tersimpan di browser ini.
      </p>
      <ClearAllButton onConfirm={clearAll} />
    </aside>
  );
}
