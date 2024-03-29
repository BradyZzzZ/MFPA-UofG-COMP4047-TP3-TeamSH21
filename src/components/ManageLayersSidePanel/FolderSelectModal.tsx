/**
 * Handles the selection and drag and drop of folders
 *
 * Developed by: UofG - SH21 Team
 * As part of COMPSCI 4047 Team Project (H) course at the University of Glasgow
 *
 * References:
 * https://www.smashingmagazine.com/2020/02/html-drag-drop-api-react/
 */

import { DragEvent, forwardRef, useImperativeHandle, useState } from 'react';

import { BigButton, CheckState, Notify } from '@/components';
import { msg } from '@/constants';
import { SidePanelIndex, useSidePanel } from '@/context';
import { getTotalFilesSize, traverseDirectory } from '@/utils';
import {
  Modal,
  ModalBody,
  ModalContent,
  Spinner,
  useDisclosure,
  Link,
} from '@nextui-org/react';
import { LuDownload, LuFolderPlus } from 'react-icons/lu';
import { PiCaretDoubleDownBold } from 'react-icons/pi';

export interface FileSelectModalRef {
  openModal: () => void;
}

const FileSelectModal = forwardRef<FileSelectModalRef>((props, ref) => {
  const [isDraggingOver, setIsDraggingOver] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const { setIndex } = useSidePanel();
  const { isOpen, onOpen, onClose, onOpenChange } = useDisclosure();

  let dragOverTimeout: NodeJS.Timeout;

  const handleDragEnter = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'copy';
    e.stopPropagation();
    clearTimeout(dragOverTimeout);
    setIsDraggingOver(true);
  };

  const handleDrop = async (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    clearTimeout(dragOverTimeout);
    dragOverTimeout = setTimeout(() => {
      setIsDraggingOver(false);
    }, 50);

    // if drop content is not a folder,
    if (e.dataTransfer.files.length !== 1) {
      Notify('error', msg.NO_GIS_FILES_OR_EMPTY, 'Invalid Item');
      return;
    }

    await handleOnSelectedDirs((e.dataTransfer.files[0] as any).path as string);
    e.stopPropagation();
  };

  const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    clearTimeout(dragOverTimeout);
    dragOverTimeout = setTimeout(() => {
      setIsDraggingOver(false);
    }, 50);
  };

  const handleOnSelectedDirs = async (path: string) => {
    setIsLoading(true);
    try {
      const existingPath: { path: string; timestamp: string }[] =
        await window.sqlite.getDirectory();

      if (existingPath.some((each) => each.path === path)) {
        Notify('error', msg.FOLDER_EXISTS, 'Folder Exists');
        setIsLoading(false);
        return;
      }

      const res: any[] = await window.pyshell.runFileSearch(path);

      // Empty folder or no GIS files
      if (res.toString() === '0') {
        Notify('error', msg.NO_GIS_FILES_OR_EMPTY, 'Invalid Item');
        setIsLoading(false);
        return;
      }

      const fileArray = res
        .filter((_, index) => index !== res.length - 1)
        .map((each) => {
          if (!each[1]) return null;
          return JSON.parse((each as string).replaceAll("'", '"'));
        })
        .filter(Boolean);
      const fileArrayName: string[] = fileArray.map((each) => each[0]);
      const totalFilesSize = fileArray.reduce((total, each) => {
        if (each[1]) {
          return total + each[1];
        } else {
          return total;
        }
      }, 0);
      const noOfFiles = res[res.length - 1];

      const tree = buildDirectoryTree(fileArrayName);

      localStorage.setItem('layersImportPreview', JSON.stringify(tree));
      localStorage.setItem('dirpath', path);
      localStorage.setItem('noOfFiles', noOfFiles);
      localStorage.setItem('totalFilesSize', getTotalFilesSize(totalFilesSize));

      setIndex(SidePanelIndex.IMPORT_PREVIEW);
    } catch (err) {
      Notify('error', (err as Error).message, 'Error Processing Folder');
    }
    setIsLoading(false);
  };

  const handleSelectFolder = () => {
    const input = document.createElement('input');

    input.onclick = (e) => {
      e.preventDefault(); // prevent default file dialog
      window.postMessage({
        // use Electron.js folder dialog instead
        type: 'select-dir',
      });
    };

    input.click();

    // listen to the "selected-dirs" response from Electron.js
    window.onmessage = (e) => {
      if (e.data.type === 'selected-dir') {
        if (e.data.data.length === 0) return;

        handleOnSelectedDirs(e.data.data[0]);
      }
    };
  };

  useImperativeHandle(ref, () => ({
    openModal: onOpen,
  }));

  const buildDirectoryTree = (input: string[]) => {
    const files = Array.from(input);

    // Build the directory tree.
    const tree = {
      name: '~/',
      isfile: false,
      ischecked: CheckState.UNCHECKED,
      filesOrDirs: [],
    };

    const pathSplitter =
      window.navigator.userAgent.indexOf('Windows') !== -1 ? '\\' : '/';
    for (let i = 0; i < files.length; i++) {
      // Split the path into an array of directories
      const path = files[i].split(pathSplitter);

      // Traverse the directory tree
      traverseDirectory(path, tree);
    }

    return tree;
  };

  return (
    <Modal
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      hideCloseButton
      size="5xl"
      placement="center"
      isDismissable={!isLoading}
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
        base: 'h-[33rem] !my-0',
      }}
    >
      <ModalContent>
        <ModalBody>
          <div
            className={`my-4 flex h-full flex-col items-center justify-center rounded-md border-2 border-dashed duration-200 ${isDraggingOver ? 'border-primary-400 bg-primary-100' : 'border-neutral-700'}`}
            onDragEnter={!isLoading ? handleDragEnter : undefined}
            onDragLeave={!isLoading ? handleDragLeave : undefined}
            onDragOver={!isLoading ? handleDragOver : undefined}
            onDrop={!isLoading ? handleDrop : undefined}
          >
            {isLoading ? (
              <>
                <div className="flex justify-center">
                  <div className="flex gap-x-2 *:text-6xl *:text-neutral-700">
                    <Spinner
                      classNames={{
                        circle1: 'border-b-textBlack',
                        circle2: 'border-b-textBlack',
                      }}
                    />
                  </div>
                </div>
                <div className="pt-2 text-center">
                  <h3 className="text-textBlack">
                    Processing folder, please wait...
                  </h3>
                </div>
              </>
            ) : isDraggingOver ? (
              <>
                <div className="flex justify-center">
                  <div className="flex gap-x-2 *:text-6xl *:text-neutral-700">
                    <PiCaretDoubleDownBold />
                  </div>
                </div>
                <div className="pt-2 text-center">
                  <h3 className="text-textBlack">Drop folder to continue</h3>
                </div>
              </>
            ) : (
              <>
                <div className="flex justify-center">
                  <div className="flex gap-x-2 *:text-6xl *:text-neutral-700">
                    <LuDownload />
                  </div>
                </div>
                <div className="pt-2 text-center">
                  <h3 className="text-lg font-bold text-textBlack">
                    Drag and drop or select folder from computer
                  </h3>
                  <p className="pt-1 text-sm text-neutral-500">
                    Supports all GDAL{' '}
                    <Link
                      href="https://gdal.org/drivers/raster/index.html"
                      isExternal
                      showAnchorIcon
                      underline="hover"
                      className="text-sm font-medium text-neutral-500"
                    >
                      raster
                    </Link>{' '}
                    and{' '}
                    <Link
                      href="https://gdal.org/drivers/vector/index.html"
                      isExternal
                      showAnchorIcon
                      underline="hover"
                      className="text-sm font-medium text-neutral-500"
                    >
                      vector
                    </Link>{' '}
                    formats
                  </p>
                </div>
                <div className="grid grid-rows-2 gap-y-2 pt-6 *:w-52">
                  <BigButton onClick={handleSelectFolder}>
                    <>
                      <LuFolderPlus className="text-xl" />
                      Select Folder
                    </>
                  </BigButton>
                  <BigButton onClick={onClose} color="btn-tertiary">
                    Cancel
                  </BigButton>
                </div>
              </>
            )}
          </div>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
});

FileSelectModal.displayName = 'FileSelectModal';

export default FileSelectModal;
