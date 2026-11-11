import type { ReactNode } from 'react';

export type AuthMode = 'login' | 'signup';

export type AuthFormKind = 'login' | 'signup' | 'recovery';

export interface AuthFieldValues {
  name: string;
  email: string;
  password: string;
}

export type AuthFieldErrors = Partial<Record<keyof AuthFieldValues, string>>;

export interface AuthFormProps {
  mode: AuthMode;
  nextPath: string;
  saveProgramId: string | null;
  initialMessage: string | null;
  adminMode: boolean;
}

export interface AuthPageProps {
  mode: AuthMode;
  searchParams: Promise<{ next?: string; save?: string; error?: string; admin?: string }>;
}

export interface AuthLayoutProps {
  title: string;
  subtitle: string;
  hidePrivacy?: boolean;
  children: ReactNode;
}

export interface AuthFieldProps {
  id: string;
  label: string;
  error?: string;
  children: ReactNode;
}

export interface AuthPasswordFieldProps {
  id: string;
  label: string;
  placeholder: string;
  autoComplete: string;
  value: string;
  error?: string;
  isDisabled: boolean;
  onChange: (value: string) => void;
}

export interface AuthTextFieldProps {
  id: string;
  label: string;
  type?: 'text' | 'email';
  autoComplete: string;
  placeholder: string;
  inputMode?: 'email';
  maxLength?: number;
  value: string;
  error?: string;
  isDisabled: boolean;
  onChange: (value: string) => void;
}

export interface RecoveryFormProps {
  nextPath: string;
}
