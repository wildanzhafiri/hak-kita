'use client';

import { FileCheck } from 'lucide-react';
import { DataNote } from '@/components/ui/data-note';
import { PROGRESS_NOTE } from './constants';
import { useRencanaState } from './rencana-context';
import { RencanaItem } from './rencana-item';
import { RencanaSuggestions } from './rencana-suggestions';

export function RencanaBerkas() {
  const { entries, untouched, clearBerkas } = useRencanaState();

  return (
    <>
      <DataNote>{PROGRESS_NOTE}</DataNote>
      {entries.length > 0 ? (
        <section>
          <h2 className="plan-heading">Sedang kamu siapkan</h2>
          <ul className="plan-list">
            {entries.map((entry) => (
              <RencanaItem
                key={entry.program.id}
                entry={entry}
                onClear={() => clearBerkas(entry.program.id)}
              />
            ))}
          </ul>
        </section>
      ) : (
        <div className="empty">
          <FileCheck size={38} />
          <h2>Belum ada berkas yang kamu siapkan.</h2>
          <p>
            Pilih program yang punya Berkas Siap Bawa, jawab beberapa pertanyaan, lalu centang
            dokumen yang sudah kamu punya. Progresnya muncul di sini.
          </p>
        </div>
      )}
      {untouched.length > 0 && (
        <RencanaSuggestions
          programs={untouched}
          heading={entries.length > 0 ? 'Siapkan berkas lain' : 'Program dengan Berkas Siap Bawa'}
        />
      )}
    </>
  );
}
