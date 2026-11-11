import { ChevronDown } from 'lucide-react';
import type { EmailPreviewFrameProps } from './types';

export function EmailPreviewFrame({
  summary,
  title,
  html,
  text,
  textToggle,
  defaultOpen = false,
}: EmailPreviewFrameProps) {
  if (!html && !text) return null;

  return (
    <details className="group mt-4 rounded-lg border border-[#dce4ed] bg-white" open={defaultOpen}>
      <summary className="flex min-h-11 cursor-pointer list-none items-center justify-between gap-3 px-4 text-sm font-semibold text-[#1769c2] [&::-webkit-details-marker]:hidden">
        {summary}
        <ChevronDown
          aria-hidden="true"
          className="shrink-0 transition-transform group-open:rotate-180 motion-reduce:transition-none"
          size={18}
        />
      </summary>
      <div className="border-t border-[#dce4ed] p-4">
        {html && (
          <iframe
            className="h-[520px] w-full rounded-lg border border-[#dce4ed] bg-white sm:h-[640px]"
            sandbox=""
            srcDoc={html}
            title={title}
          />
        )}
        {text && (
          <details className="mt-3">
            <summary className="cursor-pointer text-sm font-medium text-[#1769c2]">
              {textToggle}
            </summary>
            <pre className="mt-2 max-h-64 overflow-auto whitespace-pre-wrap break-words rounded-lg bg-[#f7f9fc] p-3 text-xs leading-5 text-[#334155]">
              {text}
            </pre>
          </details>
        )}
      </div>
    </details>
  );
}
