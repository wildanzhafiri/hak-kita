import type { ReactNode } from 'react';

export interface BreadcrumbItem {
  label: string;
  href?: string;
}

export interface PageShellProps {
  breadcrumbs: BreadcrumbItem[];
  eyebrow?: string;
  compact?: boolean;
  title: string;
  description: string;
  children: ReactNode;
}

export interface SiteFrameProps {
  header: ReactNode;
  footer: ReactNode;
  children: ReactNode;
}

export interface ComingSoonProps {
  breadcrumbs: BreadcrumbItem[];
  eyebrow: string;
  title: string;
  description: string;
  body: string;
  points: readonly string[];
  action: { href: string; label: string };
}

export interface SearchDialogProps {
  open: boolean;
  onClose: () => void;
}
