'use client';

import { useEffect, useRef, useState, type FormEvent, type KeyboardEvent } from 'react';
import { usePathname } from 'next/navigation';
import { useChat } from '@ai-sdk/react';
import { DefaultChatTransport, lastAssistantMessageIsCompleteWithApprovalResponses } from 'ai';
import { MAX_ASSISTANT_MESSAGE_COUNT } from '@hakkita/schema';
import { useAuth } from '@/hooks/use-auth';
import { markSavedProgram } from '@/hooks/saved-program-store';
import { getSavedProgramIds } from './assistant-result';

export function useAssistantChat() {
  const pathname = usePathname();
  const { user } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const listRef = useRef<HTMLDivElement>(null);
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
    if (!isOpen || !listRef.current) return;
    listRef.current.scrollTop = listRef.current.scrollHeight;
  }, [isOpen, messages, status]);

  const isBusy = status === 'submitted' || status === 'streaming';
  const isMessageLimitReached = messages.length >= MAX_ASSISTANT_MESSAGE_COUNT;
  const canSend = Boolean(input.trim()) && !isBusy && !isMessageLimitReached;
  const pageSegments = pathname.split('/').filter(Boolean);
  const pagePart = ['program', 'layanan', 'kenali-hakmu', 'urus-kebutuhanmu'].includes(pageSegments[0] ?? '')
    ? pageSegments[1] ?? pageSegments[0]
    : pageSegments.at(-1);
  const pageLabel = pagePart && !['masuk', 'daftar', 'bantuan'].includes(pagePart)
    ? pagePart.split('-').map((word) => word[0]?.toUpperCase() + word.slice(1)).join(' ')
    : null;

  function handleSend() {
    const text = input.trim();
    if (!text || !canSend) return;
    void sendMessage({ text }, { body: { currentPath: pathname } });
    setInput('');
  }

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
    setMessages([]);
  }

  return {
    user,
    isOpen,
    setIsOpen,
    input,
    setInput,
    listRef,
    messages,
    isBusy,
    isMessageLimitReached,
    canSend,
    pageLabel,
    error,
    handleSubmit,
    handleKeyDown,
    handleApproval,
    handleNewConversation,
  };
}
