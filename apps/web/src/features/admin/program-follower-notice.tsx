'use client';

import { useState } from 'react';
import { CircleCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { PROGRAM_FOLLOWER_NOTICE_COPY as COPY } from './content';
import { ProgramNewsEmail } from './program-news-email';
import { ProgramUpdateEmail } from './program-update-email';
import type { ProgramFollowerNoticeProps } from './types';

type NoticeTab = 'changes' | 'news';

export function ProgramFollowerNotice({
  programId,
  refreshKey,
  hasSavedChange,
}: ProgramFollowerNoticeProps) {
  const [tab, setTab] = useState<NoticeTab>('changes');

  return (
    <section
      aria-labelledby="program-follower-notice-title"
      className="rounded-xl border border-[#e1e9f2] bg-white p-5 sm:p-6"
      id="pemberitahuan"
    >
      <h2 className="m-0 text-lg font-semibold text-[#253044]" id="program-follower-notice-title">
        {COPY.title}
      </h2>
      <p className="mt-1 max-w-3xl text-sm leading-6 text-[#64748b]">{COPY.description}</p>
      {hasSavedChange && (
        <p
          className="mt-4 flex items-start gap-3 rounded-xl border border-[#b8e1cc] bg-[#edf8f1] px-4 py-3 text-sm text-[#226b43]"
          role="status"
        >
          <CircleCheck aria-hidden="true" className="mt-0.5 shrink-0" size={18} />
          {COPY.savedNotice}
        </p>
      )}
      <div aria-label={COPY.tabsLabel} className="mt-5 flex flex-wrap gap-2" role="group">
        <Button
          aria-pressed={tab === 'changes'}
          onPress={() => setTab('changes')}
          tone={tab === 'changes' ? 'primary' : 'secondary'}
          type="button"
        >
          {COPY.changesTab}
        </Button>
        <Button
          aria-pressed={tab === 'news'}
          onPress={() => setTab('news')}
          tone={tab === 'news' ? 'primary' : 'secondary'}
          type="button"
        >
          {COPY.newsTab}
        </Button>
      </div>
      <p className="mt-3 max-w-3xl text-sm leading-6 text-[#64748b]">
        {tab === 'changes' ? COPY.changesHint : COPY.newsHint}
      </p>
      <div className="mt-5">
        {tab === 'changes' ? (
          <ProgramUpdateEmail key={refreshKey} programId={programId} />
        ) : (
          <ProgramNewsEmail programId={programId} />
        )}
      </div>
    </section>
  );
}
