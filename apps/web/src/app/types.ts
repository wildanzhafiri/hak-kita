import type { ReactNode } from 'react';

export interface ProgramPageProps {
  params: Promise<{ id: string }>;
}

export interface RootLayoutProps {
  children: ReactNode;
}
