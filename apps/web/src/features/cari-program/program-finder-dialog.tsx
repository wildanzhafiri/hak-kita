'use client';

import { useRef, useState } from 'react';
import { ArrowRight } from 'lucide-react';
import { EMPTY_PREFERENCES } from '@hakkita/domain';
import { Button } from '@/components/ui/button';
import { Dialog } from '@/components/ui/dialog';
import { useAuth } from '@/hooks/use-auth';
import { useProfile } from '@/features/profil/use-profile';
import type { ProfileRegions } from '@/features/profil/types';
import { FINDER_COPY as COPY } from './content';
import { fetchRegions } from './finder-data';
import { FinderProfileChoice } from './finder-profile-choice';
import { FinderResults } from './finder-results';
import { FinderWizard } from './finder-wizard';
import {
  finderStorageKey,
  freshFinderState,
  loadFinderState,
  saveFinderState,
} from './finder-state';
import type { FinderDialogProps, FinderState } from './types';

export function ProgramFinderDialog({ label }: FinderDialogProps) {
  const { user } = useAuth();
  const { preferensi } = useProfile();
  const storageKey = finderStorageKey(user?.id ?? null);
  const [isOpen, setIsOpen] = useState(false);
  const [state, setState] = useState<FinderState>(() => freshFinderState(false));
  const [regions, setRegions] = useState<ProfileRegions | null>(null);
  const [regionsFailed, setRegionsFailed] = useState(false);
  const isLoadingRegions = useRef(false);

  function ensureRegions() {
    if (regions || isLoadingRegions.current) return;
    isLoadingRegions.current = true;
    setRegionsFailed(false);
    fetchRegions()
      .then(setRegions)
      .catch(() => setRegionsFailed(true))
      .finally(() => {
        isLoadingRegions.current = false;
      });
  }

  function update(changes: Partial<FinderState>) {
    const next = { ...state, ...changes };
    setState(next);
    saveFinderState(storageKey, next);
  }

  function open() {
    setState(loadFinderState(storageKey, preferensi));
    ensureRegions();
    setIsOpen(true);
  }

  function close() {
    if (state.showResults) {
      const next = { ...state, showResults: false, step: 0 };
      setState(next);
      saveFinderState(storageKey, next);
    }
    setIsOpen(false);
  }

  return (
    <>
      <Button className="max-[767px]:w-full" onPress={open}>
        {label}
        <ArrowRight aria-hidden="true" size={18} />
      </Button>
      <Dialog
        closeLabel={COPY.closeLabel}
        isTitleHidden={state.showResults}
        onOpenChange={(next) => (next ? open() : close())}
        open={isOpen}
        title={COPY.title}
        trigger={null}
        wide
      >
        {!state.showResults && (
          <p className="m-0 -mt-2 pr-7 text-sm leading-[1.55] text-[#475569] max-[767px]:-mt-1 max-[767px]:text-[13px]">
            {COPY.intro}
          </p>
        )}
        {state.showProfileChoice ? (
          <FinderProfileChoice
            onStartFresh={() =>
              update({
                answers: EMPTY_PREFERENCES,
                step: 0,
                showResults: false,
                showProfileChoice: false,
              })
            }
            onUseProfile={() => update({ answers: preferensi, showProfileChoice: false })}
          />
        ) : state.showResults ? (
          <FinderResults answers={state.answers} onClose={close} regions={regions} />
        ) : (
          <FinderWizard
            onChange={update}
            onClose={close}
            regions={regions}
            regionsFailed={regionsFailed}
            state={state}
          />
        )}
      </Dialog>
    </>
  );
}
