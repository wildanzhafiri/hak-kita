import { BERKAS_NOTE_MAX_LENGTH } from '@hakkita/domain';
import { TextAreaInput } from '@/components/ui/text-area';
import type { BerkasNoteProps } from './types';

export function BerkasNote({ note, onChange }: BerkasNoteProps) {
  return (
    <label className="berkas-note">
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
  );
}
