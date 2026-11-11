import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { FINDER_COPY as COPY } from './content';
import type { FinderProfileChoiceProps } from './types';

export function FinderProfileChoice({ onUseProfile, onStartFresh }: FinderProfileChoiceProps) {
  return (
    <section
      aria-labelledby="finder-profile-heading"
      className="mx-auto mt-[30px] w-full max-w-[744px] rounded-[14px] border border-[#e1e9f2] bg-[#f5f8fc] p-6 max-[767px]:mt-6 max-[767px]:p-5"
    >
      <h2
        className="m-0 text-2xl font-semibold leading-[1.35] text-[#253044] max-[767px]:text-[21px]"
        id="finder-profile-heading"
      >
        {COPY.profileChoiceTitle}
      </h2>
      <p className="m-0 mt-[7px] text-[15px] leading-[1.55] text-[#475569] max-[767px]:text-sm">
        {COPY.profileChoiceDescription}
      </p>
      <div className="mt-5 flex flex-wrap items-center gap-3 max-[767px]:flex-col max-[767px]:items-stretch">
        <Button onPress={onUseProfile}>
          {COPY.useProfile}
          <ArrowRight aria-hidden="true" size={17} />
        </Button>
        <Button onPress={onStartFresh} tone="secondary">
          {COPY.startFresh}
        </Button>
      </div>
    </section>
  );
}
