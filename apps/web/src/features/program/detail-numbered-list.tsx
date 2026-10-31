import type { DetailNumberedListProps } from './types';

export function DetailNumberedList({ entries }: DetailNumberedListProps) {
  return (
    <ol className="max-w-[70ch] list-decimal pl-6 text-sm leading-[1.7] text-[var(--text)]">
      {entries.map((entry) => (
        <li className="mb-3 last:mb-0 marker:font-bold marker:text-[var(--primary)]" key={entry}>
          {entry}
        </li>
      ))}
    </ol>
  );
}
