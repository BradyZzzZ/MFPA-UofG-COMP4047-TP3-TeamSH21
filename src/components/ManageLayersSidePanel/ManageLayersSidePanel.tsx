/**
 * Manage Layers page that allows the user to manage layers.
 *
 * Developed by: UofG - SH21 Team
 * As part of COMPSCI 4047 Team Project (H) course at the University of Glasgow
 */

import { useEffect, useRef, useState } from 'react';

import {
  BackButton,
  BigButton,
  ConfirmationModal,
  ConfirmationModalRef,
  Notify,
} from '@/components';
import { msg } from '@/constants';
import { SidePanelIndex, useSidePanel } from '@/context';
import { Checkbox, Spinner } from '@nextui-org/react';
import { BiLayerPlus } from 'react-icons/bi';
import { FiBookmark } from 'react-icons/fi';
import { LuTrash2, LuFolderX } from 'react-icons/lu';
import { PiWarning } from 'react-icons/pi';

import { FileSelectModal, FileSelectModalRef, FolderCheckboxList } from '.';

const ManageLayersSidePanel = () => {
  const [isSelectedAll, setIsSelectedAll] = useState(false);
  const [isDeselectedAll, setIsDeselectedAll] = useState(true);
  const [dirpath, setDirpath] = useState(localStorage.getItem('dirpath') || '');
  const [folderList, setFolderList] = useState<
    { path: string; timestamp: string }[]
  >([]);
  const [willBeDeletedFolders, setWillBeDeletedFolders] = useState<string[]>(
    []
  );
  const [foldersToBeDeleted, setFoldersToBeDeleted] = useState<string[]>([]);
  const [isUnsavedChanges, setIsUnsavedChanges] = useState(false);
  const [foldersToBeImported, setFoldersToBeImported] = useState<string[]>(
    JSON.parse(localStorage.getItem('foldersToBeImported') || '[]')
  );
  const [isSaving, setIsSaving] = useState(false);

  const fileSelectModalRef = useRef<FileSelectModalRef>(null);
  const unSavedConfirmationModalRef = useRef<ConfirmationModalRef>(null);
  const deleteConfirmationModalRef = useRef<ConfirmationModalRef>(null);

  const { setIndex } = useSidePanel();

  const getFolderPath = async () => {
    try {
      const result = await window.sqlite.getDirectory();
      for (const folder of foldersToBeImported) {
        result.unshift({ path: folder, timestamp: '' });
      }
      setFolderList(result);
    } catch (err) {
      Notify('error', (err as Error).message, 'Failed To Get Folder Path');
    }
  };

  useEffect(() => {
    setIsUnsavedChanges(false);
    getFolderPath();
    if (foldersToBeImported.length > 0) {
      setIsUnsavedChanges(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSaveChanges = async () => {
    setIsSaving(true);
    localStorage.setItem('foldersToBeImported', '[]');
    let importCount = 0;

    if (dirpath !== '') {
      try {
        for (const folder of foldersToBeImported) {
          if (willBeDeletedFolders.includes(folder)) continue;
          await window.sqlite.insertDirectory(folder, null);
          importCount++;
        }
      } catch (err) {
        Notify('error', (err as Error).message, 'Failed To Save Layer(s)');
        setDirpath('');
        localStorage.removeItem('dirpath');
        setIsSaving(false);
        return;
      }

      if (importCount > 0) {
        try {
          await window.pyshell.runUpdateDatabase();
        } catch (err) {
          Notify('error', (err as Error).message, 'Failed To Update Database');
          setIsSaving(false);
          return;
        }

        Notify(
          'success',
          `Successfully parsed and imported ${importCount} folder(s)`
        );
      }
    }

    handleDeleteSelected();

    setDirpath('');
    setIsSaving(false);
    localStorage.removeItem('dirpath');
    setIndex(SidePanelIndex.HISTORY);
  };

  const handleDeleteSelected = async () => {
    if (willBeDeletedFolders.length === 0) return;
    let deleteCount = 0;

    try {
      for (const folder of willBeDeletedFolders) {
        if (foldersToBeImported.includes(folder)) continue;
        await window.sqlite.deleteDirectory(folder);
        deleteCount++;
      }
    } catch (err) {
      Notify('error', (err as Error).message, 'Failed To Delete Layer');
      return;
    }

    if (deleteCount > 0) {
      Notify('success', `Successfully deleted ${deleteCount} layer(s)`);
    }

    setWillBeDeletedFolders([]);
    getFolderPath();
    setIsDeselectedAll(true);
    deleteConfirmationModalRef.current?.closeModal();
  };

  return (
    <div
      className="fixed z-40 h-full w-[30rem] p-4"
      id="manage_layers_side_panel"
    >
      <FileSelectModal ref={fileSelectModalRef} />
      <ConfirmationModal
        ref={unSavedConfirmationModalRef}
        text={msg.UNSAVED_CHANGES}
        icon={<PiWarning />}
        confirmText="Leave"
        confirmAction={() => {
          setIsUnsavedChanges(false);
          localStorage.setItem('foldersToBeImported', '[]');
          localStorage.setItem('dirpath', '');
          setIndex(SidePanelIndex.HISTORY);
        }}
      />
      <ConfirmationModal
        ref={deleteConfirmationModalRef}
        text={msg.DELETE_LAYER_CONFIRMATION}
        icon={<LuTrash2 />}
        confirmText="Delete"
        confirmAction={() => {
          setWillBeDeletedFolders(foldersToBeDeleted);
          setIsUnsavedChanges(true);
          deleteConfirmationModalRef.current?.closeModal();
        }}
      />
      <div className="size-full rounded-xl border border-white shadow-md backdrop-blur-sm">
        <div className="flex size-full flex-col gap-y-4 rounded-xl border border-white bg-surface shadow-md backdrop-blur-sm">
          <div>
            <div className="mx-4 my-2">
              <BackButton
                disabled={isSaving}
                onClick={() => {
                  if (isUnsavedChanges) {
                    unSavedConfirmationModalRef.current?.openModal();
                  } else {
                    setIndex(SidePanelIndex.HISTORY);
                  }
                }}
              />
              <h1 className="text-center text-lg text-textBlack">
                Manage Layers
              </h1>
            </div>
            <div className="h-px w-full bg-gray-200"></div>
          </div>
          <div className="mx-4 flex h-full animate-fade-in flex-col gap-y-2">
            <div className="flex">
              <div className="flex grow gap-x-2">
                <button
                  className="btn btn-outline btn-primary h-9 min-h-0 place-content-center p-2 disabled:opacity-40"
                  onClick={() => {
                    if (!isSelectedAll && isDeselectedAll)
                      setIsDeselectedAll((prev) => !prev);
                    setIsSelectedAll((prev) => !prev);
                  }}
                  disabled={isSelectedAll || isSaving}
                >
                  <Checkbox
                    radius="none"
                    size="sm"
                    classNames={{
                      base: 'pr-0',
                      wrapper: 'after:bg-blue rounded-sm',
                    }}
                    isSelected={isSelectedAll}
                    onChange={() => {
                      if (!isSelectedAll && isDeselectedAll) {
                        setIsDeselectedAll((prev) => !prev);
                      }
                      setIsSelectedAll((prev) => !prev);
                    }}
                  />
                  Select All
                </button>
                <button
                  className="btn btn-outline btn-primary h-9 min-h-0 place-content-center p-2 disabled:opacity-40"
                  onClick={() => {
                    if (!isDeselectedAll && isSelectedAll)
                      setIsSelectedAll((prev) => !prev);
                    setIsDeselectedAll((prev) => !prev);
                  }}
                  disabled={isDeselectedAll || isSaving}
                >
                  <Checkbox
                    radius="none"
                    size="sm"
                    classNames={{
                      base: 'pr-0',
                      wrapper: 'after:bg-blue rounded-sm',
                    }}
                    isSelected={isDeselectedAll}
                    onChange={() => {
                      if (!isDeselectedAll && isSelectedAll) {
                        setIsSelectedAll((prev) => !prev);
                      }
                      setIsDeselectedAll((prev) => !prev);
                    }}
                  />
                  Deselect All
                </button>
              </div>
              <button
                className="btn btn-outline btn-warning h-9 min-h-0 place-content-center p-2 disabled:opacity-40"
                onClick={() => {
                  if (
                    foldersToBeDeleted.length === 0 ||
                    foldersToBeDeleted === willBeDeletedFolders
                  ) {
                    Notify(
                      'error',
                      msg.EMPTY_LAYER_SELECTION,
                      'Empty layer selection'
                    );
                    return;
                  }
                  deleteConfirmationModalRef.current?.openModal();
                }}
                disabled={isSaving}
              >
                <LuTrash2 className="text-xl" />
                Delete Selected
              </button>
            </div>
            <div className="grow overflow-y-auto rounded px-1">
              {folderList.filter(
                (folder) => !willBeDeletedFolders.includes(folder.path)
              ).length !== 0 ? (
                <FolderCheckboxList
                  folderList={folderList.filter(
                    (folder) => !willBeDeletedFolders.includes(folder.path)
                  )}
                  isSelectedAll={isSelectedAll}
                  setIsSelectedAll={setIsSelectedAll}
                  isDeselectedAll={isDeselectedAll}
                  setIsDeselectedAll={setIsDeselectedAll}
                  selected={setFoldersToBeDeleted}
                  disabled={isSaving}
                />
              ) : (
                <div className="flex h-full flex-col items-center justify-center">
                  <LuFolderX className="text-5xl" />
                  No imported layers
                </div>
              )}
            </div>
            <div className="flex flex-col gap-y-2 pb-4">
              <BigButton
                onClick={() => {
                  if (willBeDeletedFolders.length > 0) {
                    Notify('error', msg.MUST_SAVE_CHANGES, 'Must Save Changes');
                  } else {
                    fileSelectModalRef.current?.openModal();
                  }
                }}
                color="btn-secondary"
                disabled={isSaving}
              >
                <>
                  <BiLayerPlus className="text-2xl" />
                  Import Layers
                </>
              </BigButton>
              <BigButton
                onClick={handleSaveChanges}
                disabled={!isUnsavedChanges || isSaving}
              >
                <>
                  {isSaving ? (
                    <>
                      <Spinner
                        size="sm"
                        classNames={{
                          circle1: 'border-b-white',
                          circle2: 'border-b-white',
                        }}
                      />
                      Parsing and Importing...
                    </>
                  ) : (
                    <>
                      <FiBookmark className="text-xl" />
                      Save Changes
                    </>
                  )}
                </>
              </BigButton>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ManageLayersSidePanel;
