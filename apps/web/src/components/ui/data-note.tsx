import { Info } from 'lucide-react';
import { DEFAULT_DATA_NOTE } from './constants';
import type { DataNoteProps } from './types';

export function DataNote({ children }: DataNoteProps) {
  return (
    <div className="data-note">
      <Info size={14} /> {children ?? DEFAULT_DATA_NOTE}
    </div>
  );
}
