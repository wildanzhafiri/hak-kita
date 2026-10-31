'use client';

import { ClearAllButton } from './clear-all-button';
import { useRencanaState } from './rencana-context';

export function DeviceDataPanel() {
  const { entries, saved, clearAll } = useRencanaState();
  if (entries.length + saved.length === 0) return null;

  return (
    <aside className="device-data">
      <p>
        {entries.length} berkas dan {saved.length} program tersimpan hanya ada di browser ini. Kalau
        data browser dihapus atau kamu pindah perangkat, semuanya ikut hilang.
      </p>
      <ClearAllButton onConfirm={clearAll} />
    </aside>
  );
}
