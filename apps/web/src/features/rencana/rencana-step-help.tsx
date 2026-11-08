'use client';

import { useState } from 'react';
import { ArrowUpRight } from 'lucide-react';
import { SelectField } from '@/components/ui/select-field';
import { STEP_GUIDE_CONTENT } from './content';
import { RencanaObstacleReport } from './rencana-obstacle-report';
import type { RencanaStepHelpProps } from './types';

export function RencanaStepHelp({ program }: RencanaStepHelpProps) {
  const [selectedIssueIndex, setSelectedIssueIndex] = useState('');
  const issues = program.berkas?.kendala ?? [];
  const selectedIssue = selectedIssueIndex === '' ? null : issues[Number(selectedIssueIndex)];

  return (
    <div className="min-w-0">
      <p className="text-sm leading-6 text-[#526173]">
        {issues.length > 0 ? STEP_GUIDE_CONTENT.helpIntro : STEP_GUIDE_CONTENT.helpUnavailable}
      </p>
      {issues.length > 0 && (
        <div className="mt-3 max-w-xl">
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
        <div className="mt-3 rounded-lg border border-[#dbe5ef] bg-white p-4 text-sm leading-6 text-[#526173]">
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
      <a
        className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-[#196dcc] underline-offset-4 hover:underline"
        href={program.sumberUtama.url}
        target="_blank"
        rel="noreferrer"
      >
        {STEP_GUIDE_CONTENT.sourceLabel} <ArrowUpRight size={15} />
      </a>
      <RencanaObstacleReport programId={program.id} />
    </div>
  );
}
