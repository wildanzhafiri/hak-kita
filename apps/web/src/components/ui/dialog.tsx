'use client';

import { Modal } from '@heroui/react';
import { X } from 'lucide-react';
import type { DialogProps } from './types';

export function Dialog({
  open,
  onOpenChange,
  title,
  description,
  closeLabel,
  children,
}: DialogProps) {
  return (
    <Modal isOpen={open} onOpenChange={onOpenChange}>
      <Modal.Backdrop
        className="fixed inset-0 z-50 grid place-items-center bg-[#182a40]/45 p-4 backdrop-blur-[2px]"
        isDismissable
      >
        <Modal.Container className="w-full max-w-[560px]" placement="center" scroll="inside">
          <Modal.Dialog className="relative max-h-[min(90vh,720px)] overflow-y-auto rounded-xl border border-[#dce1e6] bg-white p-6 text-[#25354b] shadow-xl max-[640px]:p-5">
            <Modal.Header className="flex items-start justify-between gap-5">
              <div>
                <Modal.Heading className="text-xl font-semibold leading-snug tracking-[-0.02em]">
                  {title}
                </Modal.Heading>
                {description && (
                  <p className="mt-2 text-sm leading-6 text-[#637185]">{description}</p>
                )}
              </div>
              <Modal.CloseTrigger
                aria-label={closeLabel}
                className="grid size-9 shrink-0 place-items-center rounded-lg text-[#687385] transition-colors hover:bg-[#f0f6fd] hover:text-[#196dcc] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#196dcc] motion-reduce:transition-none"
              >
                <X aria-hidden="true" size={18} />
              </Modal.CloseTrigger>
            </Modal.Header>
            <Modal.Body className="mt-5">{children}</Modal.Body>
          </Modal.Dialog>
        </Modal.Container>
      </Modal.Backdrop>
    </Modal>
  );
}
