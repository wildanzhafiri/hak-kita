import type { FormEvent, KeyboardEvent } from 'react';
import type { UIMessage } from 'ai';

export interface AssistantMessageProps {
  message: UIMessage;
  onApproval: (approvalId: string, approved: boolean) => void;
  isApprovalReady: boolean;
  isStreaming?: boolean;
  onNavigate: () => void;
}

export interface AssistantSource {
  label: string;
  url: string;
}

export interface AssistantDestination {
  label: string;
  href: string;
}

export interface AssistantTextProps {
  text: string;
}

export interface AssistantComposerProps {
  input: string;
  onInputChange: (value: string) => void;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
  onKeyDown: (event: KeyboardEvent<HTMLTextAreaElement>) => void;
  canSend: boolean;
  isWaitingForTurnstile: boolean;
  isMessageLimitReached: boolean;
  isGuest: boolean;
  turnstileSiteKey: string | undefined;
  turnstileToken: string;
  onTurnstileToken: (token: string) => void;
  turnstileResetKey: number;
  hasError: boolean;
}

export interface AssistantWelcomeProps {
  topic: string | null;
  onPrompt: (prompt: string) => void;
}
