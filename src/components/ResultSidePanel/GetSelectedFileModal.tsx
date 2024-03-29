/**
 * Modal that allows the user to select a destination path to save the selected
 * files.
 *
 * Developed by: UofG - SH21 Team
 * As part of COMPSCI 4047 Team Project (H) course at the University of Glasgow
 */

import { forwardRef, useImperativeHandle, useState } from 'react';

import { Notify } from '@/components';
import { msg } from '@/constants';
import { outputToDestination } from '@/utils';
import {
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  Radio,
  RadioGroup,
  Spinner,
  useDisclosure,
} from '@nextui-org/react';

export interface GetSelectedFileModalRef {
  openModal: () => void;
}

interface GetSelectedFileModalProps {
  selectedFiles: string[];
}

const radioClassNames = {
  wrapper: 'group-data-[selected=true]:border-blue',
  control: 'group-data-[selected=true]:bg-blue',
};

const GetSelectedFileModal = forwardRef<
  GetSelectedFileModalRef,
  GetSelectedFileModalProps
>(({ selectedFiles }, ref) => {
  const [selected, setSelected] = useState<'copy' | 'move' | 'txt'>('copy');
  const [isDestPathInvalid, setIsDestPathInvalid] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [destPath, setDestPath] = useState(
    localStorage.getItem('destPath') || ''
  );
  const [isSaving, setIsSaving] = useState(false);

  const { isOpen, onClose, onOpen, onOpenChange } = useDisclosure();

  useImperativeHandle(ref, () => ({
    openModal: onOpen,
  }));

  const handleBrowseFolder = () => {
    const input = document.createElement('input');

    if (selected === 'txt') {
      input.onclick = (e) => {
        e.preventDefault(); // prevent default file dialog
        window.postMessage({
          // use Electron.js file dialog instead
          type: 'select-file',
        });
      };
    } else {
      input.onclick = (e) => {
        e.preventDefault(); // prevent default file dialog
        window.postMessage({
          // use Electron.js folder dialog instead
          type: 'select-dir',
        });
      };
    }

    input.click();

    // listen to the "selected-dirs" response from Electron.js
    window.onmessage = (e) => {
      if (e.data.type === 'selected-dir') {
        if (e.data.data.length === 0) return;

        const path = e.data.data[0];
        setIsDestPathInvalid(false);
        setDestPath(path);
      } else if (e.data.type === 'selected-file') {
        if (e.data.data.length === 0) return;

        const path = e.data.data;
        setIsDestPathInvalid(false);
        setDestPath(path);
      }
    };
  };

  const handleSave = async () => {
    if (!destPath) {
      setErrorMessage(msg.ENTER_VALID_DEST);
      setIsDestPathInvalid(true);
      Notify('error', msg.EMPTY_DEST_PATH, 'Empty Destination Path');
      return;
    }
    if (isDestPathInvalid) {
      Notify('error', msg.INVALID_DEST_PATH, 'Invalid Destination Path');
      return;
    }
    setIsSaving(true);
    if (selected === 'txt' && !destPath.endsWith('.txt')) {
      setDestPath(destPath.concat('.txt'));
    }
    if (selected === 'txt') {
      localStorage.setItem(
        'destPath',
        destPath.substring(0, destPath.lastIndexOf('\\'))
      );
    } else {
      localStorage.setItem('destPath', destPath);
    }
    const res = await outputToDestination(selectedFiles, destPath, selected);
    if (res.status === 'success') {
      switch (selected) {
        case 'copy':
          Notify(
            'success',
            `Successfully copied ${selectedFiles.length} file(s) to:\n"${destPath}"`
          );
          break;
        case 'move':
          Notify(
            'success',
            `Successfully moved ${selectedFiles.length} file(s) to:\n"${destPath}"`
          );
          break;
        case 'txt':
          Notify(
            'success',
            `Successfully created a .txt file at:\n"${!destPath.endsWith('.txt') ? destPath.concat('.txt') : destPath}"`
          );
          break;
      }
      onClose();
    } else {
      Notify('error', res.message);
    }
    setIsSaving(false);
  };

  const handleOnInputValueChange = (e: string) => {
    if (e) setIsDestPathInvalid(false);
    const illegalChars = ['<', '>', '|', '?', '*'];
    const illegalFolderChars = ['/', '\\', ':', '"', '<', '>', '|', '?', '*'];
    const sep =
      window.navigator.userAgent.indexOf('Windows') !== -1 ? '\\' : '/';
    if (
      illegalChars.some((c) => e.includes(c)) ||
      illegalFolderChars.some((c) => e.split(sep).pop()!.includes(c))
    ) {
      setErrorMessage(msg.INVALID_CHAR_PATH);
      setIsDestPathInvalid(true);
    }
    setDestPath(e);
  };

  const handleOnRadioChange = (e: string) => {
    setSelected(e as 'copy' | 'move' | 'txt');
    if (e === 'txt' && destPath && !destPath.endsWith('.txt')) {
      setDestPath(destPath.concat('.txt'));
    } else if (e !== 'txt' && destPath.endsWith('.txt')) {
      setDestPath(destPath.slice(0, -4));
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      hideCloseButton
      size="xl"
      placement="center"
      isDismissable={!isSaving}
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
    >
      <ModalContent>
        {(onClose) => (
          <>
            <ModalBody className="mt-3 flex flex-col gap-y-4">
              <RadioGroup
                label="How would you like to get the selected intersecting files?"
                color="default"
                value={selected}
                onValueChange={handleOnRadioChange}
                isDisabled={isSaving}
                classNames={{
                  label: 'text-BLACK',
                }}
              >
                <Radio value="copy" classNames={radioClassNames}>
                  Copy to destination folder
                </Radio>
                <Radio value="move" classNames={radioClassNames}>
                  Move to destination folder
                </Radio>
                <Radio value="txt" classNames={radioClassNames}>
                  Create a .txt file with the file path
                </Radio>
              </RadioGroup>
              <div className="mt-2 flex items-end gap-x-2">
                <Input
                  autoFocus
                  label="Destination path"
                  labelPlacement="outside"
                  variant="bordered"
                  size="md"
                  radius="sm"
                  value={destPath}
                  isDisabled={isSaving}
                  onValueChange={handleOnInputValueChange}
                  placeholder="Browse or enter a destination path"
                  isInvalid={isDestPathInvalid}
                  errorMessage={`${isDestPathInvalid ? errorMessage : ''}`}
                  onDragOver={(e) => {
                    if (e.dataTransfer.types.includes('Files')) {
                      e.dataTransfer.dropEffect = 'none';
                      e.preventDefault();
                    }
                  }}
                  classNames={{
                    inputWrapper:
                      'bg-white shadow-none data-[hover=true]:border-blue-200 group-data-[focus=true]:border-blue pr-0',
                    label: 'text-BLACK text-base',
                    input: 'caret-blue',
                  }}
                  endContent={
                    <button
                      className="btn btn-primary h-full min-h-0 w-fit rounded-l-none rounded-r-[5px] ring-2 ring-blue"
                      onClick={handleBrowseFolder}
                    >
                      Browse
                    </button>
                  }
                />
              </div>
            </ModalBody>
            <ModalFooter className="-mt-2">
              <div className="mt-1 flex gap-x-4">
                <button
                  className="btn-tertiary btn h-10 min-h-0 w-44"
                  disabled={isSaving}
                  onClick={onClose}
                >
                  Cancel
                </button>
                <button
                  className="btn btn-primary h-10 min-h-0 w-44 disabled:bg-blue-200 disabled:text-white"
                  onClick={handleSave}
                  disabled={isSaving}
                >
                  {isSaving ? (
                    <>
                      <Spinner
                        size="sm"
                        classNames={{
                          circle1: 'border-b-white',
                          circle2: 'border-b-white',
                        }}
                      />
                      Processing...
                    </>
                  ) : (
                    <>Confirm</>
                  )}
                </button>
              </div>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
});

GetSelectedFileModal.displayName = 'DialogModal';

export default GetSelectedFileModal;
