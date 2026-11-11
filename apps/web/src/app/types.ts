import type { ReactNode } from 'react';

export interface ProgramPageProps {
  params: Promise<{ id: string }>;
}

export interface KenaliHakmuPageProps {
  searchParams: Promise<{ q?: string | string[]; kategori?: string | string[] }>;
}

export interface PencarianPageProps {
  searchParams: Promise<{ q?: string | string[] }>;
}

export interface RootLayoutProps {
  children: ReactNode;
}
