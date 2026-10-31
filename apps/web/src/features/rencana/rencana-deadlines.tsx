'use client';

import { CalendarClock } from 'lucide-react';
import { ButtonLink } from '@/components/ui/button-link';
import { DataNote } from '@/components/ui/data-note';
import { DEADLINE_NOTE } from './constants';
import { DeadlineRow } from './deadline-row';
import { useRencanaState } from './rencana-context';

export function RencanaDeadlines() {
  const { deadlines } = useRencanaState();

  if (deadlines.length === 0) {
    return (
      <div className="empty">
        <CalendarClock size={38} />
        <h2>Belum ada tenggat yang dipantau.</h2>
        <p>Tenggat muncul setelah kamu menyimpan program atau mulai menyiapkan berkas.</p>
        <ButtonLink href="/kenali-hakmu">Temukan program</ButtonLink>
      </div>
    );
  }

  return (
    <>
      <DataNote>{DEADLINE_NOTE}</DataNote>
      <ul className="deadline-list">
        {deadlines.map((deadline) => (
          <DeadlineRow key={deadline.program.id} deadline={deadline} />
        ))}
      </ul>
    </>
  );
}
