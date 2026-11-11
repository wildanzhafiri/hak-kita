'use client';

import { useState } from 'react';
import { ArrowUpRight, MessageSquareText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { SelectField } from '@/components/ui/select-field';
import { ASSISTANT_OPEN_EVENT } from '@/features/assistant/constants';
import { STEP_GUIDE_CONTENT } from './content';
import type { RencanaStepHelpProps } from './types';

export function RencanaStepHelp({ program }: RencanaStepHelpProps) {
  const [selectedIssueIndex, setSelectedIssueIndex] = useState('');
  const issues = program.berkas?.kendala ?? [];
  const selectedIssue = selectedIssueIndex === '' ? null : issues[Number(selectedIssueIndex)];

  function askAssistant() {
    window.dispatchEvent(
      new CustomEvent(ASSISTANT_OPEN_EVENT, {
        detail: {
          prompt: `Saya terkendala saat mengikuti ${program.nama}. Belum ada petunjuk khusus di panduan. Bisa bantu mencari arahan dari sumber yang relevan?`,
        },
      }),
    );
  }

  return (
    <div className="min-w-0">
      <p className="m-0 text-sm leading-6 text-[#526173]">
        {issues.length > 0 ? STEP_GUIDE_CONTENT.helpIntro : STEP_GUIDE_CONTENT.helpUnavailable}
      </p>
      {issues.length > 0 && (
        <div className="mt-3 w-full max-w-xl">
          <SelectField
            label="Kendala berkas"
            placeholder="Pilih kendala berkas"
            value={selectedIssueIndex}
            options={issues.map((issue, index) => ({ value: String(index), label: issue.masalah }))}
            onChange={setSelectedIssueIndex}
          />
        </div>
      )}
      {selectedIssue && (
        <div className="mt-3 rounded-lg border border-[#dbe5ef] bg-white p-3 text-sm leading-6 text-[#526173] sm:p-4">
          <p>{selectedIssue.langkah}</p>
          <a
            className="mt-2 inline-flex items-center gap-1 font-medium text-[#196dcc] underline-offset-4 hover:underline"
            href={selectedIssue.sumberUrl}
            target="_blank"
            rel="noreferrer"
          >
            Lihat sumber <ArrowUpRight size={15} />
          </a>
        </div>
      )}
      <div className="mt-4 flex flex-col items-stretch gap-3 sm:flex-row sm:items-center sm:gap-4">
        {issues.length === 0 && (
          <Button
            className="!min-h-10 !w-full !gap-2 !px-3 !text-sm sm:!w-auto"
            tone="secondary"
            onPress={askAssistant}
          >
            <MessageSquareText aria-hidden="true" size={16} /> {STEP_GUIDE_CONTENT.askAssistant}
          </Button>
        )}
        <a
          className="inline-flex max-w-full self-end items-center gap-1 text-right text-sm font-semibold text-[#196dcc] underline-offset-4 hover:underline sm:self-auto sm:text-left"
          href={program.sumberUtama.url}
          target="_blank"
          rel="noreferrer"
        >
          {STEP_GUIDE_CONTENT.sourceLabel} <ArrowUpRight size={15} />
        </a>
      </div>
    </div>
  );
}
