'use client';

import { useEffect, useRef } from 'react';
import { Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { TextAreaInput } from '@/components/ui/text-area';
import { Turnstile } from '@/components/ui/turnstile';
import { useAutoGrow } from '@/hooks/use-auto-grow';
import { ASSISTANT_INPUT_MAX_HEIGHT, ASSISTANT_MESSAGE_MAX_LENGTH } from './constants';
import { ASSISTANT_COPY, ASSISTANT_ERROR_COPY, ASSISTANT_SECURITY_COPY } from './content';
import type { AssistantComposerProps } from './types';

export function AssistantComposer({
  input,
  onInputChange,
  onSubmit,
  onKeyDown,
  canSend,
  isWaitingForTurnstile,
  isMessageLimitReached,
  isGuest,
  turnstileSiteKey,
  turnstileToken,
  onTurnstileToken,
  turnstileResetKey,
  hasError,
}: AssistantComposerProps) {
  const inputRef = useRef<HTMLTextAreaElement>(null);
  useAutoGrow(inputRef, input, ASSISTANT_INPUT_MAX_HEIGHT);

  useEffect(() => {
    if (window.innerWidth > 640) inputRef.current?.focus();
  }, []);

  return (
    <form
      className="shrink-0 border-t border-[#e1e9f2] bg-white px-3 pb-[max(12px,env(safe-area-inset-bottom))] pt-3"
      onSubmit={onSubmit}
    >
      <label className="sr-only" htmlFor="assistant-message">
        {ASSISTANT_COPY.inputLabel}
      </label>
      <div className="flex items-end gap-2.5">
        <TextAreaInput
          className="min-h-0 flex-1 resize-none overflow-y-hidden rounded-xl border-[#cbd7e4] px-3.5 py-3 text-sm leading-6 text-[#253044] focus:border-[#1769c2] focus:ring-2 focus:ring-[#1769c2] focus-visible:outline-none! max-[640px]:text-base [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          id="assistant-message"
          maxLength={ASSISTANT_MESSAGE_MAX_LENGTH}
          onChange={(event) => onInputChange(event.target.value)}
          onKeyDown={onKeyDown}
          placeholder={ASSISTANT_COPY.placeholder}
          ref={inputRef}
          rows={2}
          value={input}
        />
        <Button
          aria-label={ASSISTANT_COPY.send}
          className="size-11 min-h-0 shrink-0 rounded-[10px] p-0 disabled:bg-[#eef1f6] disabled:text-[#8b99ab] disabled:opacity-100"
          isDisabled={!canSend}
          type="submit"
        >
          <Send aria-hidden="true" size={19} />
        </Button>
      </div>
      {isWaitingForTurnstile && (
        <p className="mb-0 mt-2 text-xs text-[#607189]" role="status">
          {ASSISTANT_SECURITY_COPY}
        </p>
      )}
      {isGuest && turnstileSiteKey && !turnstileToken ? (
        <div className="mt-2" aria-live="polite">
          <Turnstile
            action="assistant_chat"
            appearance="interaction-only"
            label="Verifikasi keamanan chat"
            onToken={onTurnstileToken}
            resetKey={turnstileResetKey}
            siteKey={turnstileSiteKey}
          />
        </div>
      ) : null}
      {isGuest && !turnstileSiteKey ? (
        <p className="mb-0 mt-2 text-xs text-[#68788d]" role="status">
          Chat pengunjung sementara belum tersedia.
        </p>
      ) : null}
      {isMessageLimitReached && (
        <p className="mb-0 mt-2 text-xs text-[#68788d]">Mulai percakapan baru untuk melanjutkan.</p>
      )}
      {hasError && (
        <p className="mb-0 mt-2 text-sm text-[#b72f35]" role="alert">
          {ASSISTANT_ERROR_COPY}
        </p>
      )}
    </form>
  );
}
