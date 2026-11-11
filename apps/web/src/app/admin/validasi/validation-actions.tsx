import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { VALIDATION_DETAIL_COPY as COPY } from './content';
import type { ValidationActionsProps } from './types';

export function ValidationActions({
  isConfirmed,
  isBusy,
  error,
  onConfirmChange,
  onApprove,
  onEdit,
  onReject,
}: ValidationActionsProps) {
  return (
    <section className="mb-6 mt-7 border-t border-[#dce5ef] pt-6">
      <h2 className="mb-4 text-lg font-semibold tracking-[-0.01em] text-[#253044]">
        {COPY.sections.actions}
      </h2>
      <Checkbox isSelected={isConfirmed} isDisabled={isBusy} onChange={onConfirmChange}>
        {COPY.confirm}
      </Checkbox>
      {error && (
        <p className="mt-4 text-sm text-[#a72b32]" role="alert">
          {error}
        </p>
      )}
      <div className="mt-5 flex flex-wrap items-center gap-2.5">
        <Button isDisabled={isBusy || !isConfirmed} onPress={onApprove} type="button">
          {isBusy ? COPY.saving : COPY.approve}
        </Button>
        <Button isDisabled={isBusy} onPress={onEdit} tone="secondary" type="button">
          {COPY.correct}
        </Button>
        <Button isDisabled={isBusy} onPress={onReject} tone="danger-outline" type="button">
          {COPY.reject}
        </Button>
      </div>
    </section>
  );
}
