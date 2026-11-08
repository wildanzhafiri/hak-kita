'use client';

import { Mail } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useEmailNotificationPreference } from '@/hooks/use-email-notification-preference';
import { EMAIL_NOTIFICATION_CONTENT } from './content';

export function RencanaEmailPreference() {
  const { enabled, isLoading, isSaving, error, setEnabled, retry } =
    useEmailNotificationPreference();

  return (
    <div className="mt-5 flex flex-wrap items-center justify-between gap-4 border-t border-[#e1e7ee] pt-5">
      <div className="flex min-w-0 items-start gap-3">
        <Mail aria-hidden="true" size={20} className="mt-1 shrink-0 text-[#196dcc]" />
        <div>
          <h3 className="text-base font-semibold text-[#1b304c]">
            {EMAIL_NOTIFICATION_CONTENT.title}
          </h3>
          <p className="mt-1 max-w-2xl text-sm leading-6 text-[#617087]">
            {EMAIL_NOTIFICATION_CONTENT.description}
          </p>
          <p className="mt-1 text-xs text-[#617087]" aria-live="polite">
            {isLoading
              ? EMAIL_NOTIFICATION_CONTENT.loading
              : enabled
                ? EMAIL_NOTIFICATION_CONTENT.active
                : EMAIL_NOTIFICATION_CONTENT.inactive}
          </p>
          {error && (
            <div role="alert" className="mt-2 flex flex-wrap items-center gap-2 text-sm text-[#b72f35]">
              <span>{error}</span>
              <Button tone="quiet" className="min-h-8 px-1 text-sm" onPress={retry}>
                {EMAIL_NOTIFICATION_CONTENT.retry}
              </Button>
            </div>
          )}
        </div>
      </div>
      <Button
        tone={enabled ? 'secondary' : 'primary'}
        aria-pressed={enabled}
        isDisabled={isLoading || isSaving || !!error}
        onPress={() => void setEnabled(!enabled)}
      >
        {enabled ? EMAIL_NOTIFICATION_CONTENT.disable : EMAIL_NOTIFICATION_CONTENT.enable}
      </Button>
    </div>
  );
}
