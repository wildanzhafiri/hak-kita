'use client';

import { usePathname } from 'next/navigation';
import { Modal } from '@heroui/react';
import { MessageSquareText, MessagesSquare, RotateCcw, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { AssistantComposer } from './assistant-composer';
import { AssistantMessage } from './assistant-message';
import { AssistantWelcome } from './assistant-welcome';
import { ASSISTANT_COPY, ASSISTANT_LOADING_COPY } from './content';
import { useAssistantChat } from './use-assistant-chat';

export function AssistantChat() {
  const pathname = usePathname();
  if (pathname.startsWith('/admin')) return null;
  return <AssistantChatPanel />;
}

function AssistantChatPanel() {
  const {
    user,
    isOpen,
    setIsOpen,
    input,
    setInput,
    turnstileSiteKey,
    turnstileToken,
    setTurnstileToken,
    turnstileResetKey,
    listRef,
    messages,
    isBusy,
    isWaitingForTurnstile,
    isMessageLimitReached,
    canSend,
    pageTopic,
    error,
    handleSubmit,
    handleKeyDown,
    handleApproval,
    handleNewConversation,
    submitText,
  } = useAssistantChat();

  return (
    <Modal isOpen={isOpen} onOpenChange={setIsOpen}>
      <Button
        aria-label={ASSISTANT_COPY.open}
        className="fixed bottom-[max(20px,env(safe-area-inset-bottom))] right-4 z-40 size-12 min-h-12 rounded-full p-0 text-sm shadow-[0_8px_26px_#17395b36] sm:bottom-7 sm:right-7 sm:size-auto sm:min-h-12 sm:px-5"
        onPress={() => setIsOpen(true)}
      >
        <MessageSquareText aria-hidden="true" size={20} />
        <span className="hidden sm:inline">Tanya HAKKITA</span>
      </Button>
      <Modal.Backdrop
        className="fixed inset-0 z-50 flex animate-none items-end justify-end bg-[#182a40]/30 p-6 backdrop-blur-[2px] transition-opacity duration-300 ease-out data-[entering]:opacity-0 data-[exiting]:opacity-0 motion-reduce:transition-none max-[640px]:p-0"
        isDismissable
      >
        <Modal.Container
          className="h-[min(660px,calc(100dvh-48px))] w-full max-w-[440px] origin-bottom-right animate-none p-0 transition-[opacity,translate,scale] duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] data-[entering]:translate-y-5 data-[entering]:scale-95 data-[entering]:opacity-0 data-[exiting]:translate-y-3 data-[exiting]:scale-95 data-[exiting]:opacity-0 motion-reduce:transition-none max-[640px]:h-dvh max-[640px]:max-w-none"
          placement="auto"
          scroll="inside"
        >
          <Modal.Dialog
            aria-label={ASSISTANT_COPY.title}
            className="flex h-full w-full max-w-none flex-col overflow-hidden rounded-2xl border border-[#e1e9f2] bg-white p-0 text-[#25354b] shadow-[0_18px_48px_#25304433] max-[640px]:rounded-none max-[640px]:border-0"
          >
            <header className="flex shrink-0 items-center gap-2.5 border-b border-[#e1e9f2] bg-white py-3.5 pl-4 pr-2.5 max-[640px]:pt-[max(14px,env(safe-area-inset-top))]">
              <span className="grid size-10 shrink-0 place-items-center rounded-[11px] bg-[#edf5ff] text-[#1769c2]">
                <MessagesSquare aria-hidden="true" size={22} />
              </span>
              <div className="min-w-0 flex-1">
                <Modal.Heading className="m-0 text-base font-semibold leading-snug text-[#253044]">
                  {ASSISTANT_COPY.title}
                </Modal.Heading>
                <p className="mb-0 mt-0.5 text-xs leading-4 text-[#64748b]">
                  {ASSISTANT_COPY.subtitle}
                </p>
              </div>
              {messages.length > 0 && (
                <Button
                  aria-label={ASSISTANT_COPY.newConversation}
                  className="size-11"
                  isDisabled={isBusy}
                  onPress={handleNewConversation}
                  tone="icon"
                >
                  <RotateCcw aria-hidden="true" size={18} />
                </Button>
              )}
              <Modal.CloseTrigger
                aria-label={ASSISTANT_COPY.close}
                className="static grid size-11 shrink-0 place-items-center rounded-lg bg-transparent text-[#64748b] transition-colors hover:bg-[#edf5ff] hover:text-[#1769c2] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1769c2] motion-reduce:transition-none"
              >
                <X aria-hidden="true" size={21} />
              </Modal.CloseTrigger>
            </header>

            <div
              aria-label={ASSISTANT_COPY.conversation}
              aria-live="polite"
              className="min-h-0 flex-1 space-y-5 overflow-y-auto overscroll-contain bg-[#f8fafc] px-4 py-5 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
              ref={listRef}
            >
              {messages.length === 0 ? (
                <AssistantWelcome onPrompt={submitText} topic={pageTopic} />
              ) : (
                messages.map((message, index) => (
                  <AssistantMessage
                    isApprovalReady={!isBusy}
                    isStreaming={isBusy && index === messages.length - 1}
                    key={message.id}
                    message={message}
                    onApproval={handleApproval}
                    onNavigate={() => setIsOpen(false)}
                  />
                ))
              )}
              {isBusy && (
                <div
                  aria-label={ASSISTANT_LOADING_COPY}
                  className="inline-flex items-center gap-2.5 text-sm text-[#607189]"
                  role="status"
                >
                  <span aria-hidden="true" className="inline-flex items-center gap-1">
                    <span className="size-1.5 rounded-full bg-[#196dcc] motion-safe:animate-pulse motion-reduce:animate-none" />
                    <span className="size-1.5 rounded-full bg-[#196dcc] [animation-delay:180ms] motion-safe:animate-pulse motion-reduce:animate-none" />
                    <span className="size-1.5 rounded-full bg-[#196dcc] [animation-delay:360ms] motion-safe:animate-pulse motion-reduce:animate-none" />
                  </span>
                  <span>{ASSISTANT_LOADING_COPY}</span>
                </div>
              )}
            </div>

            <AssistantComposer
              canSend={canSend}
              hasError={Boolean(error)}
              input={input}
              isGuest={!user}
              isMessageLimitReached={isMessageLimitReached}
              isWaitingForTurnstile={isWaitingForTurnstile}
              onInputChange={setInput}
              onKeyDown={handleKeyDown}
              onSubmit={handleSubmit}
              onTurnstileToken={setTurnstileToken}
              turnstileResetKey={turnstileResetKey}
              turnstileSiteKey={turnstileSiteKey}
              turnstileToken={turnstileToken}
            />
          </Modal.Dialog>
        </Modal.Container>
      </Modal.Backdrop>
    </Modal>
  );
}
