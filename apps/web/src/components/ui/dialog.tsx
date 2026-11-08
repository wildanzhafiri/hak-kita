'use client';

import { Modal } from '@heroui/react';
import { X } from 'lucide-react';
import type { DialogProps } from './types';

export function Dialog({
  trigger,
  open,
  onOpenChange,
  title,
  description,
  closeLabel,
  children,
  side = false,
}: DialogProps) {
  return (
    <Modal isOpen={open} onOpenChange={onOpenChange}>
      {trigger}
      <Modal.Backdrop
        className={
          side
            ? 'fixed inset-0 z-50 flex justify-end bg-[#182a40]/35 transition-opacity duration-300 data-[entering]:opacity-0 data-[exiting]:opacity-0 motion-reduce:transition-none max-lg:bg-white'
            : 'fixed inset-0 z-50 grid place-items-center bg-[#182a40]/45 p-4 backdrop-blur-[2px]'
        }
        isDismissable
      >
        <Modal.Container
          className={
            side
              ? 'ml-auto mr-0 h-full w-full max-w-none p-0 transition-transform duration-300 max-lg:data-[entering]:translate-y-full max-lg:data-[exiting]:translate-y-full lg:max-w-[720px] lg:data-[entering]:translate-x-full lg:data-[exiting]:translate-x-full motion-reduce:transition-none'
              : 'w-full max-w-[560px]'
          }
          placement={side ? 'auto' : 'center'}
          scroll="inside"
        >
          <Modal.Dialog
            className={
              side
                ? 'flex h-dvh max-h-none w-full max-w-none flex-col overflow-hidden rounded-none bg-white p-0 text-[#25354b] lg:border-l lg:border-[#dce1e6] lg:shadow-2xl'
                : 'relative max-h-[min(90vh,720px)] overflow-y-auto rounded-xl border border-[#dce1e6] bg-white p-6 text-[#25354b] shadow-xl max-[640px]:p-5'
            }
          >
            <Modal.Header
              className={
                side
                  ? 'flex shrink-0 items-start justify-between gap-5 border-b border-[#e1e7ee] px-5 py-4 md:px-8 md:py-5'
                  : 'flex items-start justify-between gap-5'
              }
            >
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
            <Modal.Body className={side ? 'flex min-h-0 flex-1 flex-col overflow-hidden' : 'mt-5'}>
              {children}
            </Modal.Body>
          </Modal.Dialog>
        </Modal.Container>
      </Modal.Backdrop>
    </Modal>
  );
}
