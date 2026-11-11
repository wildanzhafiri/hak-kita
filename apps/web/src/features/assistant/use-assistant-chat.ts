'use client';

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type FormEvent,
  type KeyboardEvent,
} from 'react';
import { usePathname } from 'next/navigation';
import { useChat } from '@ai-sdk/react';
import { DefaultChatTransport, lastAssistantMessageIsCompleteWithApprovalResponses } from 'ai';
import { MAX_ASSISTANT_MESSAGE_COUNT } from '@hakkita/schema';
import { useAuth } from '@/hooks/use-auth';
import { markSavedProgram } from '@/hooks/saved-program-store';
import { getSavedProgramIds } from './assistant-result';
import { readPageTopic } from './page-topic';

export function useAssistantChat() {
  const pathname = usePathname();
  const { user } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [turnstileToken, setTurnstileToken] = useState('');
  const [turnstileResetKey, setTurnstileResetKey] = useState(0);
  const [isWaitingForTurnstile, setIsWaitingForTurnstile] = useState(false);
  const listRef = useRef<HTMLDivElement>(null);
  const pendingMessageRef = useRef<string | null>(null);
  const [transport] = useState(() => new DefaultChatTransport({ api: '/api/assistant' }));

  const { messages, sendMessage, addToolApprovalResponse, setMessages, status, error } = useChat({
    transport,
    sendAutomaticallyWhen: lastAssistantMessageIsCompleteWithApprovalResponses,
    onFinish: ({ message }) => {
      const userId = user?.id;
      if (!userId) return;
      getSavedProgramIds(message).forEach((programId) => markSavedProgram(userId, programId));
    },
  });

  useEffect(() => {
    if (!isOpen || !listRef.current || messages.length === 0) return;
    listRef.current.scrollTop = listRef.current.scrollHeight;
  }, [isOpen, messages, status]);

  const pageTopic = isOpen ? readPageTopic(pathname, document.title) : null;
  const isBusy = status === 'submitted' || status === 'streaming';
  const isMessageLimitReached = messages.length >= MAX_ASSISTANT_MESSAGE_COUNT;
  const turnstileSiteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;
  const canSubmit =
    !isBusy &&
    !isWaitingForTurnstile &&
    !isMessageLimitReached &&
    (Boolean(user) || Boolean(turnstileSiteKey));
  const canSend = Boolean(input.trim()) && canSubmit;
  function submitText(value: string) {
    const text = value.trim();
    if (!text || !canSubmit) return;
    if (!user && !turnstileToken) {
      pendingMessageRef.current = text;
      setIsWaitingForTurnstile(true);
      return;
    }
    void sendMessage(
      { text },
      {
        body: {
          currentPath: pathname,
          ...(!user && turnstileToken ? { turnstileToken } : {}),
        },
      },
    );
    if (!user) {
      setTurnstileToken('');
      setTurnstileResetKey((value) => value + 1);
    }
    setInput('');
  }

  function handleSend() {
    submitText(input);
  }

  const handleTurnstileToken = useCallback(
    (token: string) => {
      setTurnstileToken(token);
      if (!token) {
        pendingMessageRef.current = null;
        setIsWaitingForTurnstile(false);
        return;
      }

      const pendingMessage = pendingMessageRef.current;
      if (!pendingMessage) return;

      pendingMessageRef.current = null;
      setIsWaitingForTurnstile(false);
      setTurnstileToken('');
      setTurnstileResetKey((value) => value + 1);
      setInput('');
      void sendMessage(
        { text: pendingMessage },
        { body: { currentPath: pathname, turnstileToken: token } },
      );
    },
    [pathname, sendMessage],
  );

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    handleSend();
  }

  function handleKeyDown(event: KeyboardEvent<HTMLTextAreaElement>) {
    if (event.key !== 'Enter' || event.shiftKey || event.nativeEvent.isComposing) return;
    event.preventDefault();
    handleSend();
  }

  function handleApproval(approvalId: string, approved: boolean) {
    if (isBusy) return;
    void addToolApprovalResponse({
      id: approvalId,
      approved,
      options: { body: { currentPath: pathname } },
    });
  }

  function handleNewConversation() {
    pendingMessageRef.current = null;
    setIsWaitingForTurnstile(false);
    setMessages([]);
  }

  return {
    user,
    isOpen,
    setIsOpen,
    input,
    setInput,
    turnstileSiteKey,
    turnstileToken,
    setTurnstileToken: handleTurnstileToken,
    turnstileResetKey,
    isWaitingForTurnstile,
    listRef,
    messages,
    isBusy,
    isMessageLimitReached,
    canSend,
    pageTopic,
    error,
    handleSubmit,
    handleKeyDown,
    handleApproval,
    handleNewConversation,
    submitText,
  };
}
