import type { UIMessage } from 'ai';

export interface AssistantMessageProps {
  message: UIMessage;
  onApproval: (approvalId: string, approved: boolean) => void;
  isApprovalReady: boolean;
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
