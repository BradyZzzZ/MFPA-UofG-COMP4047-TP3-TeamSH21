/**
 * Display import preview as a file tree with import button.
 *
 * Developed by: UofG - SH21 Team
 * As part of COMPSCI 4047 Team Project (H) course at the University of Glasgow
 */

import { useRef, useState } from 'react';

import {
  BackButton,
  BigButton,
  ConfirmationModal,
  ConfirmationModalRef,
  FileTree,
} from '@/components';
import { msg } from '@/constants';
import { SidePanelIndex, useSidePanel } from '@/context';
import { PiWarning } from 'react-icons/pi';
import { TbFileImport } from 'react-icons/tb';

const ImportPreviewSidePanel = () => {
  const [isSelectedAll, setIsSelectedAll] = useState(true);
  const [isDeselectedAll, setIsDeselectedAll] = useState(false);
  const [noOfFiles, setNoOfFiles] = useState(
    localStorage.getItem('noOfFiles') || '99'
  );
  const [totalFilesSize, setTotalFilesSize] = useState(
    localStorage.getItem('totalFilesSize') || '0.00 Bytes'
  );

  const confirmationModalRef = useRef<ConfirmationModalRef>(null);

  const { setIndex } = useSidePanel();

  const handleConfirmImport = () => {
    setIndex(SidePanelIndex.MANAGE_LAYERS);

    const dirPath = localStorage.getItem('dirpath');
    const foldersToBeImported = JSON.parse(
      localStorage.getItem('foldersToBeImported') || '[]'
    );
    if (!foldersToBeImported.includes(dirPath)) {
      foldersToBeImported.push(dirPath);
      localStorage.setItem(
        'foldersToBeImported',
        JSON.stringify(foldersToBeImported)
      );
    }
  };

  return (
    <div
      className="fixed z-40 h-full w-[30rem] p-4"
      id="import_preview_side_panel"
    >
      <ConfirmationModal
        ref={confirmationModalRef}
        text={msg.UNFINISHED_IMPORT}
        icon={<PiWarning />}
        confirmText="Leave"
        confirmAction={() => {
          setIndex(SidePanelIndex.MANAGE_LAYERS);
        }}
      />
      <div className="size-full rounded-xl border border-white shadow-md backdrop-blur-sm">
        <div className="flex size-full flex-col gap-y-4 rounded-xl border border-white bg-surface shadow-md backdrop-blur-sm">
          <div>
            <div className="mx-4 my-2">
              <BackButton
                onClick={() => confirmationModalRef.current?.openModal()}
              />
              <h1 className="text-center text-lg text-textBlack">
                Import Preview
              </h1>
            </div>
            <div className="h-px w-full bg-gray-200"></div>
          </div>
          <div className="mx-4 flex h-full animate-fade-in flex-col gap-y-2">
            <div className="grow overflow-y-auto rounded">
              <FileTree
                isSelectedAll={isSelectedAll}
                setIsSelectedAll={setIsSelectedAll}
                isDeselectedAll={isDeselectedAll}
                setIsDeselectedAll={setIsDeselectedAll}
                tree={JSON.parse(
                  localStorage.getItem('layersImportPreview') || '{}'
                )}
                isCheckboxVisible={false}
              />
            </div>
            <div className="flex flex-col pb-4">
              <div>
                <p className="text-sm leading-4">
                  Total files to be imported: {noOfFiles}
                </p>
                <p className="mb-2 text-sm leading-4">Size: {totalFilesSize}</p>
              </div>
              <BigButton onClick={handleConfirmImport}>
                <>
                  <TbFileImport className="text-xl" />
                  Import
                </>
              </BigButton>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ImportPreviewSidePanel;
