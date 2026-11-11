import { Button } from '@/components/ui/button';
import { Dialog } from '@/components/ui/dialog';
import { PROFILE_EDITOR_COPY as COPY } from './content';
import type { UnsavedChangesDialogProps } from './types';

export function UnsavedChangesDialog({ open, onStay, onLeave }: UnsavedChangesDialogProps) {
  return (
    <Dialog
      closeLabel={COPY.unsavedClose}
      description={COPY.unsavedDescription}
      onOpenChange={(isOpen) => {
        if (!isOpen) onStay();
      }}
      open={open}
      title={COPY.unsavedTitle}
      trigger={null}
    >
      <div className="flex gap-3">
        <Button className="flex-1" onPress={onStay} tone="secondary">
          {COPY.unsavedStay}
        </Button>
        <Button className="flex-1" onPress={onLeave}>
          {COPY.unsavedLeave}
        </Button>
      </div>
    </Dialog>
  );
}
