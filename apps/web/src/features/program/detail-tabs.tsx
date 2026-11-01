'use client';

import { useRef } from 'react';
import type { KeyboardEvent } from 'react';
import { Button } from '@/components/ui/button';
import { DETAIL_TABS } from './content';
import type { DetailTabsProps } from './types';

export function DetailTabs({ activeTab, onSelect }: DetailTabsProps) {
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);

  function handleKeyDown(event: KeyboardEvent<HTMLButtonElement>, index: number) {
    let nextIndex = index;

    if (event.key === 'ArrowRight') nextIndex = (index + 1) % DETAIL_TABS.length;
    else if (event.key === 'ArrowLeft')
      nextIndex = (index - 1 + DETAIL_TABS.length) % DETAIL_TABS.length;
    else if (event.key === 'Home') nextIndex = 0;
    else if (event.key === 'End') nextIndex = DETAIL_TABS.length - 1;
    else return;

    const nextTab = DETAIL_TABS[nextIndex];
    if (!nextTab) return;
    event.preventDefault();
    onSelect(nextTab.id);
    tabRefs.current[nextIndex]?.focus();
  }

  return (
    <div
      className="mb-5 flex gap-1 overflow-x-auto border-b border-[var(--border)]"
      role="tablist"
      aria-label="Informasi detail"
    >
      {DETAIL_TABS.map((tab, index) => (
        <Button
          key={tab.id}
          ref={(element) => {
            tabRefs.current[index] = element;
          }}
          id={`detail-tab-${tab.id}`}
          type="button"
          role="tab"
          aria-controls={`detail-panel-${tab.id}`}
          aria-selected={activeTab === tab.id}
          tabIndex={activeTab === tab.id ? 0 : -1}
          tone="quiet"
          className={`shrink-0 whitespace-nowrap rounded-none border-b-2 px-[18px] py-[14px] text-xs hover:bg-transparent ${activeTab === tab.id ? 'border-[var(--primary)] font-semibold text-[var(--primary)]' : 'border-transparent text-[var(--muted)]'}`}
          onPress={() => onSelect(tab.id)}
          onKeyDown={(event) => handleKeyDown(event, index)}
        >
          {tab.label}
        </Button>
      ))}
    </div>
  );
}
