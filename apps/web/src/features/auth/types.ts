export type AuthMode = 'login' | 'signup';

export interface AuthFormProps {
  mode: AuthMode;
  nextPath: string;
  saveProgramId: string | null;
  initialMessage: string | null;
}

export interface AuthPageProps {
  mode: AuthMode;
  searchParams: Promise<{ next?: string; save?: string; error?: string }>;
}
