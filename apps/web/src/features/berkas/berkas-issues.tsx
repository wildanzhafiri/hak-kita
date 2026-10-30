import type { BerkasIssuesProps } from './types';

export function BerkasIssues({ kendala }: BerkasIssuesProps) {
  return (
    <div className="issue-list">
      {kendala.map((issue) => (
        <details key={issue.masalah}>
          <summary>{issue.masalah}</summary>
          <p>{issue.langkah}</p>
          <a
            className="text-link source-link"
            href={issue.sumberUrl}
            target="_blank"
            rel="noreferrer"
          >
            Lihat sumber
          </a>
        </details>
      ))}
    </div>
  );
}
