import { ArrowUpRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ASSISTANT_COPY, ASSISTANT_DETAIL_PROMPTS, ASSISTANT_PROMPTS } from './content';
import type { AssistantWelcomeProps } from './types';

export function AssistantWelcome({ topic, onPrompt }: AssistantWelcomeProps) {
  return (
    <div className="pt-3">
      <h3 className="m-0 text-lg font-semibold leading-snug text-[#253044]">
        {ASSISTANT_COPY.welcomeTitle}
      </h3>
      <p className="mb-0 mt-2 text-sm leading-6 text-[#475569]">{ASSISTANT_COPY.welcomeIntro}</p>
      <p className="mb-0 mt-6 text-[13px] leading-5 text-[#64748b]">
        {topic ? ASSISTANT_COPY.topicPrompt(topic) : ASSISTANT_COPY.promptsLabel}
      </p>
      <div className="mt-3.5 flex flex-col gap-2.5">
        {(topic ? ASSISTANT_DETAIL_PROMPTS : ASSISTANT_PROMPTS).map((prompt, index) => (
          <Button
            className="min-h-[46px] w-full justify-between gap-3 rounded-xl border-[#e1e9f2] px-3.5 py-2.5 text-left text-sm font-normal text-[#475569] hover:border-[#1769c2] hover:bg-[#edf5ff] motion-safe:animate-[assistant-reveal_380ms_cubic-bezier(0.22,1,0.36,1)_both]"
            key={prompt}
            onPress={() => onPrompt(prompt)}
            style={{ animationDelay: `${120 + index * 60}ms` }}
            tone="secondary"
          >
            <span className="min-w-0 flex-1">{prompt}</span>
            <ArrowUpRight aria-hidden="true" className="shrink-0 text-[#1769c2]" size={16} />
          </Button>
        ))}
      </div>
    </div>
  );
}
