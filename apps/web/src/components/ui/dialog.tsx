'use client';

import { Modal, cn } from '@heroui/react';
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
  mobileSheet = false,
  wide = false,
  isTitleHidden = false,
}: DialogProps) {
  return (
    <Modal isOpen={open} onOpenChange={onOpenChange}>
      {trigger}
      <Modal.Backdrop
        className={
          side
            ? mobileSheet
              ? 'fixed inset-0 z-50 flex justify-end bg-[#182a40]/35 transition-opacity duration-300 data-[entering]:opacity-0 data-[exiting]:opacity-0 motion-reduce:transition-none max-[640px]:items-end max-[640px]:justify-center'
              : 'fixed inset-0 z-50 flex justify-end bg-[#182a40]/35 transition-opacity duration-300 data-[entering]:opacity-0 data-[exiting]:opacity-0 motion-reduce:transition-none max-[640px]:bg-white'
            : wide
              ? 'fixed inset-0 z-50 grid place-items-center bg-[#182b42]/40 p-6 max-[640px]:p-[18px]'
              : 'fixed inset-0 z-50 grid place-items-center bg-[#182a40]/45 p-4 backdrop-blur-[2px]'
        }
        isDismissable
      >
        <Modal.Container
          className={
            side
              ? mobileSheet
                ? 'ml-auto mr-0 h-full w-full max-w-[380px] p-0 transition-transform duration-300 max-[640px]:ml-0 max-[640px]:mr-0 max-[640px]:h-auto max-[640px]:max-h-[88dvh] max-[640px]:max-w-none max-[640px]:data-[entering]:translate-y-full max-[640px]:data-[exiting]:translate-y-full not-max-[640px]:data-[entering]:translate-x-full not-max-[640px]:data-[exiting]:translate-x-full motion-reduce:transition-none'
                : 'ml-auto mr-0 h-full w-full max-w-[380px] p-0 transition-transform duration-300 max-[640px]:max-w-none max-[640px]:data-[entering]:translate-y-full max-[640px]:data-[exiting]:translate-y-full not-max-[640px]:data-[entering]:translate-x-full not-max-[640px]:data-[exiting]:translate-x-full motion-reduce:transition-none'
              : wide
                ? 'w-full max-w-[780px] p-0'
                : 'w-full max-w-[560px]'
          }
          placement={side ? 'auto' : 'center'}
          scroll="inside"
        >
          <Modal.Dialog
            className={
              side
                ? mobileSheet
                  ? 'flex h-dvh max-h-none w-full max-w-none flex-col overflow-hidden rounded-none bg-white p-0 text-[#25354b] not-max-[640px]:border-l not-max-[640px]:border-[#dce1e6] not-max-[640px]:shadow-2xl max-[640px]:h-auto max-[640px]:max-h-[88dvh] max-[640px]:rounded-t-2xl max-[640px]:shadow-2xl'
                  : 'flex h-dvh max-h-none w-full max-w-none flex-col overflow-hidden rounded-none bg-white p-0 text-[#25354b] not-max-[640px]:border-l not-max-[640px]:border-[#dce1e6] not-max-[640px]:shadow-2xl'
                : wide
                  ? cn(
                      'relative w-full! max-w-[780px]! max-h-[calc(100dvh-48px)] overflow-y-auto overscroll-contain rounded-[15px] bg-white px-8 pb-6 pt-[30px] text-[#25354b] shadow-[0_15px_50px_#172b3a22] max-[640px]:max-h-[calc(100dvh-36px)] max-[640px]:px-5 max-[640px]:pb-5 max-[640px]:pt-[26px]',
                      isTitleHidden && 'pt-4 max-[640px]:pt-4',
                    )
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
                <Modal.Heading
                  className={cn(
                    'text-xl font-semibold leading-snug tracking-[-0.02em]',
                    wide && 'pr-6 text-[25px] max-[640px]:text-[22px]',
                    isTitleHidden && 'sr-only',
                  )}
                >
                  {title}
                </Modal.Heading>
                {description && (
                  <p className="mt-2 text-sm leading-6 text-[#637185]">{description}</p>
                )}
              </div>
              <Modal.CloseTrigger
                aria-label={closeLabel}
                className={cn(
                  'grid size-9 shrink-0 place-items-center rounded-lg text-[#687385] transition-colors hover:bg-[#f0f6fd] hover:text-[#196dcc] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#196dcc] motion-reduce:transition-none',
                  wide && 'absolute right-3 top-3 z-10',
                )}
              >
                <X aria-hidden="true" size={18} />
              </Modal.CloseTrigger>
            </Modal.Header>
            <Modal.Body
              className={
                side
                  ? 'flex min-h-0 flex-1 flex-col overflow-hidden'
                  : wide
                    ? isTitleHidden
                      ? 'mt-1'
                      : 'mt-[11px]'
                    : 'mt-5'
              }
            >
              {children}
            </Modal.Body>
          </Modal.Dialog>
        </Modal.Container>
      </Modal.Backdrop>
    </Modal>
  );
}
