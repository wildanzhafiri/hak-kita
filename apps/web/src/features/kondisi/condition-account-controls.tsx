'use client';

import Link from 'next/link';
import { Checkbox } from '@heroui/react';
import { Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { CONDITION_ACCOUNT_COPY } from './content';
import type { ConditionAccountControlsProps } from './types';

export function ConditionAccountControls({
  isAuthenticated,
  isConfigured,
  isLoading,
  isSaving,
  isSavedToAccount,
  error,
  onSaveChange,
}: ConditionAccountControlsProps) {
  return (
    <section className="panel">
      <h2>{CONDITION_ACCOUNT_COPY.title}</h2>
      {isAuthenticated ? (
        <>
          <Checkbox
            className="flex min-w-0"
            isDisabled={isLoading || isSaving}
            isSelected={isSavedToAccount}
            onChange={onSaveChange}
          >
            <Checkbox.Content className="flex min-w-0 items-start gap-3">
              <Checkbox.Control className="mt-0.5 grid size-5 shrink-0 place-items-center rounded border border-[#aeb8c4] text-white transition-colors data-[selected=true]:border-[#196dcc] data-[selected=true]:bg-[#196dcc]">
                <Checkbox.Indicator>
                  <Check aria-hidden="true" size={14} />
                </Checkbox.Indicator>
              </Checkbox.Control>
              <span>
                <strong>{CONDITION_ACCOUNT_COPY.accountPrompt}</strong>
                <small>{CONDITION_ACCOUNT_COPY.accountDescription}</small>
              </span>
            </Checkbox.Content>
          </Checkbox>
          <p className="small-note">{CONDITION_ACCOUNT_COPY.accountDeleteHint}</p>
        </>
      ) : isConfigured ? (
        <p>
          {CONDITION_ACCOUNT_COPY.signIn}{' '}
          <Link className="text-link" href="/masuk?next=%2Fperiksa-kondisimu">
            Masuk
          </Link>
        </p>
      ) : (
        <p>{CONDITION_ACCOUNT_COPY.local}</p>
      )}
      {isLoading && <p role="status">{CONDITION_ACCOUNT_COPY.loading}</p>}
      {isSaving && <p role="status">{CONDITION_ACCOUNT_COPY.saving}</p>}
      {error && <p role="alert">{error}</p>}
      {isAuthenticated && isSavedToAccount && (
        <Button
          className="mt-3"
          isDisabled={isLoading || isSaving}
          onPress={() => onSaveChange(false)}
          tone="danger"
          type="button"
        >
          Hapus profil dari akun
        </Button>
      )}
    </section>
  );
}
