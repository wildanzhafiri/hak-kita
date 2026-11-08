import type { AssistantTextProps } from './types';

function renderInline(text: string) {
  return text.split(/(\*\*[^*]+\*\*)/g).map((segment, index) =>
    segment.startsWith('**') && segment.endsWith('**') ? (
      <strong className="font-semibold text-[#1b304c]" key={index}>
        {segment.slice(2, -2)}
      </strong>
    ) : (
      segment
    ),
  );
}

export function AssistantText({ text }: AssistantTextProps) {
  const lines = text.replace(/([.:;])\s+(?=\d+\.\s)/g, '$1\n').split('\n');
  return (
    <div className="space-y-2.5 text-[14px] leading-[1.7] text-[#34465e]">
      {lines
        .filter((line) => line.trim())
        .map((line, index) => {
          const numbered = line.match(/^\s*(\d+)\.\s+(.+)$/);
          if (numbered) {
            return (
              <p className="flex gap-2.5 text-[#34465e]" key={index}>
                <span className="font-semibold text-[#196dcc]">{numbered[1]}.</span>
                <span>{renderInline(numbered[2] ?? '')}</span>
              </p>
            );
          }

          const bullet = line.match(/^\s*-\s+(.+)$/);
          if (bullet) {
            return (
              <p className="flex gap-2.5 text-[#34465e]" key={index}>
                <span
                  aria-hidden="true"
                  className="mt-[9px] size-1.5 shrink-0 rounded-full bg-[#196dcc]"
                />
                <span>{renderInline(bullet[1] ?? '')}</span>
              </p>
            );
          }

          return (
            <p className="whitespace-pre-wrap break-words text-[#34465e]" key={index}>
              {renderInline(line)}
            </p>
          );
        })}
    </div>
  );
}
