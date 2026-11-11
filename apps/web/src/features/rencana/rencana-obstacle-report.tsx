'use client';

import { useState } from 'react';
import { Checkbox } from '@heroui/react';
import { Check, Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { SelectField } from '@/components/ui/select-field';
import { OBSTACLE_STAGE_OPTIONS, STEP_GUIDE_CONTENT } from './content';
import { RencanaTurnstile } from './rencana-turnstile';
import type {
  ObstacleReportResponse,
  RencanaObstacleReportProps,
  SelectedObstacleStage,
} from './types';

export function RencanaObstacleReport({ programId }: RencanaObstacleReportProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [stage, setStage] = useState<SelectedObstacleStage>('');
  const [hasConsent, setHasConsent] = useState(false);
  const [token, setToken] = useState('');
  const [resetKey, setResetKey] = useState(0);
  const [isSending, setIsSending] = useState(false);
  const [isSent, setIsSent] = useState(false);
  const [error, setError] = useState('');
  const siteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;

  async function handleSend() {
    if (!stage || !hasConsent || !token || isSending) return;
    setIsSending(true);
    setError('');
    try {
      const response = await fetch('/api/obstacle-reports', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          programId,
          stage,
          regionCode: 'ID',
          turnstileToken: token,
          consent: true,
        }),
      });
      const result: ObstacleReportResponse = await response.json();
      if (!response.ok || !result.accepted) {
        setError(result.error ?? STEP_GUIDE_CONTENT.reportError);
        setResetKey((value) => value + 1);
        setToken('');
        return;
      }
      setIsSent(true);
    } catch {
      setError(STEP_GUIDE_CONTENT.reportError);
      setResetKey((value) => value + 1);
      setToken('');
    } finally {
      setIsSending(false);
    }
  }

  if (!siteKey) {
    return (
      <p className="mt-4 text-xs leading-5 text-[#68788d]">
        {STEP_GUIDE_CONTENT.reportUnavailable}
      </p>
    );
  }
  if (isSent) {
    return (
      <p role="status" className="mt-4 rounded-lg bg-[#edf7f0] p-3 text-sm text-[#256242]">
        {STEP_GUIDE_CONTENT.reportSuccess}
      </p>
    );
  }

  return (
    <div className="mt-4 border-t border-[#dbe5ef] pt-4">
      <Button
        tone="secondary"
        className="h-auto min-h-9 max-w-full px-3 py-2 text-left text-sm whitespace-normal"
        onPress={() => setIsOpen((value) => !value)}
      >
        {STEP_GUIDE_CONTENT.reportLabel}
      </Button>
      {isOpen && (
        <div className="mt-4 grid max-w-xl gap-3 rounded-xl border border-[#dbe5ef] bg-white p-4">
          <p className="m-0 text-sm leading-6 text-[#526173]">{STEP_GUIDE_CONTENT.reportIntro}</p>
          <div>
            <p className="mb-2 text-sm font-medium text-[#25354b]">Tahap yang menghambat</p>
            <SelectField
              label="Tahap yang menghambat"
              placeholder="Pilih tahap"
              value={stage}
              options={OBSTACLE_STAGE_OPTIONS.map((option) => ({ ...option }))}
              onChange={(value) => setStage(value as SelectedObstacleStage)}
            />
          </div>
          <Checkbox isSelected={hasConsent} onChange={setHasConsent}>
            <Checkbox.Content className="flex items-start gap-2 text-sm leading-5 text-[#25354b]">
              <Checkbox.Control className="mt-0.5 grid size-5 shrink-0 place-items-center rounded border border-[#aeb8c4] text-white data-[selected=true]:border-[#196dcc] data-[selected=true]:bg-[#196dcc]">
                <Checkbox.Indicator>
                  <Check aria-hidden="true" size={14} />
                </Checkbox.Indicator>
              </Checkbox.Control>
              <span>{STEP_GUIDE_CONTENT.reportConsent}</span>
            </Checkbox.Content>
          </Checkbox>
          <p className="m-0 text-xs leading-5 text-[#68788d]">{STEP_GUIDE_CONTENT.reportPrivacy}</p>
          <RencanaTurnstile siteKey={siteKey} resetKey={resetKey} onToken={setToken} />
          {error && (
            <p role="alert" className="m-0 text-sm text-[#b72f35]">
              {error}
            </p>
          )}
          <Button
            className="justify-self-start"
            isDisabled={!stage || !hasConsent || !token || isSending}
            onPress={handleSend}
          >
            <Send size={16} /> {isSending ? 'Mengirim laporan' : 'Kirim laporan anonim'}
          </Button>
        </div>
      )}
    </div>
  );
}
