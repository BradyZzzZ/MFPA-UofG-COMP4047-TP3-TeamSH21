/**
 * Confirmation modal that can be used to confirm an action.
 *
 * Developed by: UofG - SH21 Team
 * As part of COMPSCI 4047 Team Project (H) course at the University of Glasgow
 */

import {
  MouseEventHandler,
  ReactNode,
  forwardRef,
  useImperativeHandle,
} from 'react';

import {
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  useDisclosure,
} from '@nextui-org/react';

export enum ModalType {
  PRIMARY = 'primary',
  WARNING = 'warning',
}

interface ConfirmationModalProps {
  type?: ModalType;
  text: string | ReactNode;
  cancelText?: string;
  confirmText?: string;
  icon?: ReactNode;
  cancelAction?: MouseEventHandler<HTMLButtonElement>;
  confirmAction?: MouseEventHandler<HTMLButtonElement>;
}

export interface ConfirmationModalRef {
  openModal: () => void;
  closeModal: () => void;
}

const ConfirmationModal = forwardRef<
  ConfirmationModalRef,
  ConfirmationModalProps
>(
  (
    {
      type = ModalType.WARNING,
      text = '',
      cancelText = 'Cancel',
      confirmText = 'Confirm',
      icon,
      cancelAction,
      confirmAction,
    },
    ref
  ) => {
    const { isOpen, onClose, onOpen, onOpenChange } = useDisclosure();

    useImperativeHandle(ref, () => ({
      openModal: onOpen,
      closeModal: onClose,
    }));

    return (
      <Modal
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        hideCloseButton
        size="sm"
        placement="center"
        motionProps={{
          variants: {
            enter: {
              y: 0,
              opacity: 1,
              transition: {
                duration: 0.3,
                ease: 'easeOut',
              },
            },
            exit: {
              y: -20,
              opacity: 0,
              transition: {
                duration: 0.2,
                ease: 'easeIn',
              },
            },
          },
        }}
        classNames={{
          base: 'max-w-96',
        }}
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalBody className="mt-3">
                {icon && (
                  <div
                    className={`flex justify-center text-[56px] ${
                      type === 'primary' ? 'text-blue' : 'text-warning'
                    }`}
                  >
                    {icon}
                  </div>
                )}
                <div className="-mt-1 max-h-56 overflow-y-auto whitespace-pre-line text-pretty break-words text-center text-textBlack">
                  {text}
                </div>
              </ModalBody>
              <ModalFooter className="-mt-2">
                <div className="mt-1 grid w-full grid-cols-2 gap-x-4">
                  <button
                    className="btn-tertiary btn h-10 min-h-0"
                    onClick={!cancelAction ? onClose : cancelAction}
                  >
                    {cancelText}
                  </button>
                  <button
                    className={`btn h-10 min-h-0 ${
                      type === 'primary' ? 'btn-primary' : 'btn-warning'
                    }`}
                    onClick={(e) => {
                      if (confirmAction) confirmAction(e);
                    }}
                  >
                    {confirmText}
                  </button>
                </div>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    );
  }
);

ConfirmationModal.displayName = 'ConfirmationModal';

export default ConfirmationModal;
