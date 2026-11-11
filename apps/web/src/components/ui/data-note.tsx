import { Info } from 'lucide-react';
import type { DataNoteProps } from './types';

export function DataNote({ children }: DataNoteProps) {
  return (
    <div className="data-note">
      <Info size={14} /> {children}
    </div>
  );
}
