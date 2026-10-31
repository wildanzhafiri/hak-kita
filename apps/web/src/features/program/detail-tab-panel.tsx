import type { DetailTabPanelProps } from './types';

export function DetailTabPanel({ id, isActive, children }: DetailTabPanelProps) {
  return (
    <div
      id={`detail-panel-${id}`}
      role="tabpanel"
      aria-labelledby={`detail-tab-${id}`}
      hidden={!isActive}
      tabIndex={0}
      className="min-w-0 rounded-[14px] border border-[var(--border)] bg-[var(--surface)] px-[22px] sm:px-8"
    >
      {children}
    </div>
  );
}
