'use client';

import { Bookmark } from 'lucide-react';
import { ProgramGrid } from '@/components/program/program-grid';
import { ButtonLink } from '@/components/ui/button-link';
import { useRencanaState } from './rencana-context';

export function RencanaSaved() {
  const { saved, wilayah, builtOn } = useRencanaState();

  if (saved.length === 0) {
    return (
      <div className="empty">
        <Bookmark size={38} />
        <h2>Belum ada program tersimpan.</h2>
        <p>
          Tekan ikon simpan di kartu program atau di halaman detailnya, lalu programnya muncul di
          sini.
        </p>
        <ButtonLink href="/kenali-hakmu">Temukan program</ButtonLink>
      </div>
    );
  }

  return (
    <div className="rencana-saved">
      <ProgramGrid programs={saved} wilayah={wilayah} builtOn={builtOn} />
    </div>
  );
}
