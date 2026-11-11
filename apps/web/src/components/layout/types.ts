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

export interface AdminShellProps {
  adminEmail: string;
  activeSection: AdminSection;
  children: ReactNode;
}

export type AdminSection = 'radar' | 'programs' | 'history';

export interface AdminSidebarProps {
  activeSection: AdminSection;
  adminEmail: string;
  isSigningOut: boolean;
  signOutError: string | null;
  onNavigate?: () => void;
  onSignOut: () => void;
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

export interface AuthProviderProps {
  children: ReactNode;
}

export interface AuthNavActionProps {
  currentPath: string;
  variant?: 'inline' | 'sheet';
}

export interface MobileNavigationProps {
  pathname: string;
}
