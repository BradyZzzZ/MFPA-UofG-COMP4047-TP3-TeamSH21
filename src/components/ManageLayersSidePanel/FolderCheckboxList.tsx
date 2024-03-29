/**
 * List of folders with checkboxes
 *
 * Developed by: UofG - SH21 Team
 * As part of COMPSCI 4047 Team Project (H) course at the University of Glasgow
 */

import { Dispatch, SetStateAction, useEffect, useState } from 'react';

import { formatUnixTimestamp } from '@/utils';
import { Checkbox } from '@nextui-org/react';
import { FaRegFolderClosed } from 'react-icons/fa6';

interface FolderCheckboxListProps {
  folderList: { path: string; timestamp: string }[];
  isSelectedAll: boolean;
  setIsSelectedAll: Dispatch<SetStateAction<boolean>>;
  isDeselectedAll: boolean;
  setIsDeselectedAll: Dispatch<SetStateAction<boolean>>;
  selected: Dispatch<SetStateAction<string[]>>;
  disabled?: boolean;
}

const FolderCheckboxList = ({
  folderList,
  isSelectedAll,
  setIsSelectedAll,
  isDeselectedAll,
  setIsDeselectedAll,
  selected,
  disabled = false,
}: FolderCheckboxListProps) => {
  const [selectedFolders, setSelectedFolders] = useState<string[]>([]);
  useEffect(() => {
    if (isSelectedAll) {
      setSelectedFolders(folderList.map((each) => each.path));
    } else if (isDeselectedAll) {
      setSelectedFolders([]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSelectedAll, isDeselectedAll]);

  useEffect(() => {
    selected(selectedFolders);
  }, [selectedFolders, selected]);

  useEffect(() => {
    if (selectedFolders.length === 0) {
      setIsDeselectedAll(true);
    } else {
      setIsDeselectedAll(false);
    }
  }, [selectedFolders, setIsDeselectedAll]);

  useEffect(() => {
    if (selectedFolders.length === folderList.length) {
      setIsSelectedAll(true);
    } else {
      setIsSelectedAll(false);
    }
  }, [selectedFolders, folderList.length, setIsSelectedAll]);

  return (
    <div className="-mb-[50rem] w-fit min-w-full divide-y">
      {folderList.map((folder, index) => (
        <div
          key={index}
          className={`rounded py-1 duration-100 hover:bg-neutral-200/60 hover:shadow active:bg-neutral-300/60 ${disabled && 'pointer-events-none'}`}
        >
          <Checkbox
            radius="none"
            size="sm"
            isSelected={selectedFolders.includes(folder.path)}
            isDisabled={disabled}
            onChange={(e) => {
              const isChecked = e.target.checked;
              if (isChecked) {
                setSelectedFolders((prev) => [...prev, folder.path]);
              } else {
                setSelectedFolders((prev) =>
                  prev.filter((item) => item !== folder.path)
                );
              }
            }}
            classNames={{
              base: 'max-w-full w-full',
              wrapper: 'after:bg-blue rounded-sm ml-2 mr-2.5',
              label: 'text-nowrap',
            }}
          >
            <div className="flex items-center gap-x-1.5">
              <FaRegFolderClosed />
              <h2 className="font-semibold">{folder.path}</h2>
            </div>
            {folder.timestamp ? (
              <p className="text-xs">
                Last modified: {formatUnixTimestamp(Number(folder.timestamp))}
              </p>
            ) : (
              <p className="text-xs">To be imported</p>
            )}
          </Checkbox>
        </div>
      ))}
    </div>
  );
};

export default FolderCheckboxList;
