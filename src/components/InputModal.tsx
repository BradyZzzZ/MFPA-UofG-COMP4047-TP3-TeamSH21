/**
 * Modal with an input field.
 *
 * Developed by: UofG - SH21 Team
 * As part of COMPSCI 4047 Team Project (H) course at the University of Glasgow
 */

import {
  Dispatch,
  MouseEventHandler,
  ReactNode,
  SetStateAction,
  forwardRef,
  useEffect,
  useImperativeHandle,
  useState,
} from 'react';

import {
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  useDisclosure,
} from '@nextui-org/react';

interface InputModalProps {
  setTextInput: Dispatch<SetStateAction<string>>;
  text: string | ReactNode;
  defaultValue?: string;
  placeholder?: string;
  icon?: ReactNode;
  cancelText?: string;
  confirmText?: string;
  errorMessage?: string;
  cancelAction?: MouseEventHandler<HTMLButtonElement>;
  confirmAction?: (newName: string) => void;
}

export interface InputModalRef {
  openModal: () => void;
  closeModal: () => void;
}

const InputModal = forwardRef<InputModalRef, InputModalProps>(
  (
    {
      setTextInput,
      text,
      defaultValue,
      placeholder,
      icon,
      cancelText = 'Cancel',
      confirmText = 'OK',
      errorMessage,
      cancelAction,
      confirmAction,
    },
    ref
  ) => {
    const [isInvalid, setIsInvalid] = useState(false);
    const [value, setValue] = useState(defaultValue || '');

    const { isOpen, onClose, onOpen, onOpenChange } = useDisclosure();

    useImperativeHandle(ref, () => ({
      openModal: onOpen,
      closeModal: onClose,
    }));

    useEffect(() => {
      if (isOpen) setValue(defaultValue || '');
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isOpen]);

    useEffect(() => {
      if (isInvalid) setIsInvalid(false);
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [value]);

    const handleConfirm = () => {
      if (!value) {
        setIsInvalid(true);
        return;
      }
      setTextInput(value);
      if (confirmAction) confirmAction(value);
    };

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
                  <div className="flex justify-center text-5xl text-blue">
                    {icon}
                  </div>
                )}
                <div className="-mt-1 max-h-56 overflow-y-auto whitespace-pre-line text-pretty break-words text-center text-textBlack">
                  {text}
                </div>
                <Input
                  // isClearable
                  autoFocus
                  onFocus={(e) => (e.target as HTMLInputElement).select()}
                  variant="bordered"
                  size="lg"
                  radius="sm"
                  placeholder={placeholder}
                  value={value}
                  onValueChange={setValue}
                  // onClear={() => setValue('')}
                  isInvalid={isInvalid}
                  errorMessage={isInvalid ? errorMessage : ''}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') handleConfirm();
                    if (e.key === 'Escape') onClose();
                  }}
                  classNames={{
                    inputWrapper:
                      'shadow-none data-[hover=true]:border-blue-200 group-data-[focus=true]:border-blue',
                    input: 'caret-blue',
                  }}
                />
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
                    className="btn btn-primary h-10 min-h-0"
                    onClick={handleConfirm}
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

InputModal.displayName = 'InputModal';

export default InputModal;
