import { BERKAS_NOTE_MAX_LENGTH } from '@hakkita/domain';
import { TextAreaInput } from '@/components/ui/text-area';
import type { BerkasNoteProps } from './types';

export function BerkasNote({ note, onChange }: BerkasNoteProps) {
  return (
    <div className="berkas-note">
      <label className="grid gap-2">
        <span>Catatan untuk dirimu sendiri</span>
        <TextAreaInput
          className="min-h-24 resize-y"
          value={note}
          maxLength={BERKAS_NOTE_MAX_LENGTH}
          rows={4}
          placeholder="Misalnya: tanya operator sekolah soal NISN hari Senin"
          onChange={(e) => onChange(e.target.value)}
        />
      </label>
      <small>Jangan tulis NIK, nama lengkap, atau isi dokumen di catatan.</small>
    </div>
  );
}
