'use client';

import { useMemo } from 'react';
import type { Berkas } from '@hakkita/schema';
import {
  EMPTY_BERKAS_PROGRESS,
  parseBerkasProgress,
  prunedChecked,
  selectDokumen,
  serializeBerkasProgress,
  type BerkasProgress,
} from '@hakkita/domain';
import { useStoredValue } from '@/hooks/use-stored-value';
import { BERKAS_STORAGE_PREFIX } from '@/config/storage';
import type { UseBerkasProgressResult } from './types';

export function useBerkasProgress(programId: string, berkas: Berkas): UseBerkasProgressResult {
  const [raw, store] = useStoredValue(`${BERKAS_STORAGE_PREFIX}${programId}`);
  const progress = useMemo(() => parseBerkasProgress(raw), [raw]);

  function save(next: BerkasProgress) {
    store(serializeBerkasProgress(next));
  }

  return {
    progress,
    answer: (questionId, value) => {
      const answers = { ...progress.answers, [questionId]: value };
      const checked = prunedChecked(progress.checked, selectDokumen(berkas, answers));
      save({ ...progress, answers, checked });
    },
    toggle: (dokumenId) => {
      const checked = progress.checked.includes(dokumenId)
        ? progress.checked.filter((id) => id !== dokumenId)
        : [...progress.checked, dokumenId];
      save({ ...progress, checked });
    },
    setNote: (note) => save({ ...progress, note }),
    reset: () => save(EMPTY_BERKAS_PROGRESS),
  };
}
