'use client';

import { ArrowUp, LoaderCircle, MessageCircle, RotateCcw, ShieldCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog } from '@/components/ui/dialog';
import { TextAreaInput } from '@/components/ui/text-area';
import { AssistantMessage } from './assistant-message';
import { ASSISTANT_ERROR_COPY, ASSISTANT_PRIVACY_NOTE, ASSISTANT_PROMPTS } from './content';
import { useAssistantChat } from './use-assistant-chat';

export function AssistantChat() {
  const {
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
  } = useAssistantChat();

  return (
    <Dialog
      closeLabel="Tutup asisten"
      description="Tanya program dan layanan publik"
      onOpenChange={setIsOpen}
      open={isOpen}
      side
      title="Tanya HAKKITA"
      trigger={
        <Button
          aria-label="Buka asisten HAKKITA"
          className="fixed bottom-[max(20px,env(safe-area-inset-bottom))] right-5 z-40 min-h-12 rounded-full px-5 text-sm shadow-[0_8px_26px_#17395b36] transition-transform hover:-translate-y-0.5 motion-reduce:transform-none sm:bottom-7 sm:right-7"
          onPress={() => setIsOpen(true)}
        >
          <MessageCircle aria-hidden="true" size={19} /> Tanya HAKKITA
        </Button>
      }
    >
      <div className="flex min-h-0 flex-1 flex-col">
        <div className="flex shrink-0 items-center justify-between gap-3 border-b border-[#e1e7ee] bg-white px-5 py-2.5 md:px-8">
          <span className="inline-flex min-w-0 items-center gap-1.5 truncate text-xs text-[#607189]">
            <ShieldCheck aria-hidden="true" className="text-[#196dcc]" size={15} />
            {pageLabel ? `Konteks: ${pageLabel}` : 'Bersumber dari kanal resmi'}
          </span>
          {messages.length > 0 && (
            <Button
              aria-label="Percakapan baru"
              className="size-8"
              onPress={handleNewConversation}
              tone="icon"
            >
              <RotateCcw aria-hidden="true" size={16} />
            </Button>
          )}
        </div>

        <div
          aria-label="Percakapan"
          aria-live="polite"
          className="min-h-0 flex-1 space-y-7 overflow-y-auto overscroll-contain bg-white px-5 py-6 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden md:px-8 md:py-8"
          ref={listRef}
        >
          {messages.length === 0 ? (
            <div className="grid max-w-[580px] gap-5 py-5 motion-safe:animate-[assistant-reveal_260ms_ease-out_both]">
              <div className="grid size-11 place-items-center rounded-xl bg-[#e5f1fe] text-[#196dcc]">
                <MessageCircle aria-hidden="true" size={21} />
              </div>
              <div>
                <h2 className="text-lg font-semibold tracking-tight text-[#1b304c]">
                  Apa yang ingin kamu ketahui?
                </h2>
                <p className="mt-2 max-w-[35ch] text-sm leading-6 text-[#607189]">
                  Tanya tentang halaman ini, cari program lain, atau minta bantuan memahami sumber
                  resmi.
                </p>
              </div>
              <div className="grid gap-2 sm:grid-cols-2">
                {ASSISTANT_PROMPTS.map((prompt) => (
                  <Button
                    className="min-h-0 justify-start rounded-xl px-3.5 py-3 text-left text-sm font-medium"
                    key={prompt}
                    onPress={() => setInput(prompt)}
                    tone="secondary"
                  >
                    {prompt}
                  </Button>
                ))}
              </div>
              <p className="max-w-[60ch] text-xs leading-5 text-[#728095]">
                {ASSISTANT_PRIVACY_NOTE}
              </p>
            </div>
          ) : (
            messages.map((message) => (
              <AssistantMessage
                isApprovalReady={!isBusy}
                key={message.id}
                message={message}
                onApproval={handleApproval}
                onNavigate={() => setIsOpen(false)}
              />
            ))
          )}
          {isBusy && (
            <p className="inline-flex items-center gap-2 text-xs text-[#607189]">
              <LoaderCircle
                aria-hidden="true"
                className="animate-spin motion-reduce:animate-none"
                size={15}
              />
              Sedang mencari jawaban…
            </p>
          )}
        </div>

        <form
          className="shrink-0 border-t border-[#e1e7ee] bg-white px-5 pb-[max(16px,env(safe-area-inset-bottom))] pt-4 md:px-8 md:pb-6"
          onSubmit={handleSubmit}
        >
          <label className="sr-only" htmlFor="assistant-message">
            Tulis pertanyaan
          </label>
          <div className="assistant-message-input flex items-end gap-2 rounded-xl border border-[#cbd7e4] bg-white p-2 shadow-[0_2px_8px_#17395b0a] focus-within:border-[#196dcc] focus-within:ring-2 focus-within:ring-[#196dcc]/10">
            <TextAreaInput
              className="max-h-32 min-h-10 flex-1 resize-none border-0 px-2 py-2 shadow-none focus:ring-0 focus-visible:outline-none"
              id="assistant-message"
              maxLength={2_000}
              onChange={(event) => setInput(event.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Tanya tentang program atau halaman ini..."
              rows={1}
              value={input}
            />
            <Button
              aria-label="Kirim pesan"
              className="size-10 shrink-0 rounded-lg p-0"
              isDisabled={!canSend}
              type="submit"
            >
              <ArrowUp aria-hidden="true" size={18} />
            </Button>
          </div>
          <p className="mt-2 hidden text-[11px] leading-4 text-[#728095] sm:block">
            Enter untuk mengirim, Shift+Enter untuk baris baru.
          </p>
          {isMessageLimitReached && (
            <p className="mt-2 text-xs text-[#68788d]">Mulai percakapan baru untuk melanjutkan.</p>
          )}
          {error && (
            <p className="mt-2 text-sm text-[#b72f35]" role="alert">
              {ASSISTANT_ERROR_COPY}
            </p>
          )}
        </form>
      </div>
    </Dialog>
  );
}
