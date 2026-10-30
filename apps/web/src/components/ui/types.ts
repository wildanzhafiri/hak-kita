import type { ReactNode } from 'react';

export interface ButtonLinkProps {
  href: string;
  children: ReactNode;
  secondary?: boolean;
}

export interface EyebrowProps {
  children: ReactNode;
  light?: boolean;
  marker?: boolean;
}

export interface SectionHeadProps {
  eyebrow: string;
  title: string;
  description?: string;
  href?: string;
  linkText?: string;
}

export interface DataNoteProps {
  children?: ReactNode;
}

export interface SearchBarProps {
  inputLabel: string;
  placeholder: string;
  submitIcon: ReactNode;
  autoFocus?: boolean;
  onSubmitted?: () => void;
}

export interface DataTableRow {
  key: string;
  cells: ReactNode[];
}

export interface DataTableProps {
  columns: string[];
  rows: DataTableRow[];
}
