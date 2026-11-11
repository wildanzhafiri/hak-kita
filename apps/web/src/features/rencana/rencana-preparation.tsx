'use client';

import { RencanaEmailReminder } from './rencana-email-reminder';
import { RencanaStepGuide } from './rencana-step-guide';
import type { RencanaPreparationProps } from './types';

export function RencanaPreparation({ program, isEmailAvailable }: RencanaPreparationProps) {
  return (
    <div className="grid gap-5">
      <RencanaStepGuide program={program} />
      <RencanaEmailReminder isEmailAvailable={isEmailAvailable} program={program} />
    </div>
  );
}
